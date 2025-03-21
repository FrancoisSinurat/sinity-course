import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from sklearn.decomposition import TruncatedSVD
from sklearn.metrics.pairwise import cosine_similarity

# Load datasets
courses = pd.read_csv("Coursera_courses.csv")
reviews = pd.read_csv("Coursera_reviews.csv")

courses.drop(columns="course_url")
reviews.drop(columns="date_reviews")


# Step 1: Generate Unique Course ID
course_id_mapping = {course: idx for idx, course in enumerate(courses['course_id'].unique())}
courses['course_id_unq'] = courses['course_id'].map(course_id_mapping)
reviews['course_id_unq'] = reviews['course_id'].map(course_id_mapping)

# Step 2: Tokenize Course Names for Learning Path
vectorizer = TfidfVectorizer(stop_words='english')
tfidf_matrix = vectorizer.fit_transform(courses['name'])

# Step 3: Clustering Courses into Learning Paths
num_clusters = 5  # You can change this based on data
kmeans = KMeans(n_clusters=num_clusters, random_state=42, n_init=10)
courses['learning_path'] = kmeans.fit_predict(tfidf_matrix)

# Step 4: Collaborative Filtering using SVD
ratings_matrix = reviews.pivot(index='reviewers', columns='course_id_unq', values='rating').fillna(0)
svd = TruncatedSVD(n_components=10, random_state=42)
latent_matrix = svd.fit_transform(ratings_matrix)

# Step 5: Hybrid Recommendation System
def hybrid_recommend(user_id, top_n=5):
    if user_id in ratings_matrix.index:
        # Collaborative Filtering
        user_vector = latent_matrix[ratings_matrix.index.get_loc(user_id)].reshape(1, -1)
        similarities = cosine_similarity(user_vector, latent_matrix)
        similar_users = np.argsort(similarities.flatten())[::-1][1:top_n+1]
        recommended_courses = ratings_matrix.iloc[similar_users].mean().sort_values(ascending=False).index[:top_n]
    else:
        # Content-Based Filtering (Learning Path)
        random_learning_path = np.random.choice(courses['learning_path'].unique())
        recommended_courses = courses[courses['learning_path'] == random_learning_path]['course_id_unq'].sample(n=top_n, replace=True)
    
    return courses[courses['course_id_unq'].isin(recommended_courses)][['name', 'learning_path']]

# Example Usage
sample_user_id = reviews['reviewers'].iloc[0]
recommendations = hybrid_recommend(sample_user_id)
print(recommendations)
