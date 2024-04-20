from rest_framework import serializers
from .models import Movie, Rating, UserMovie, Question, Quiz, UserQuiz
from django.contrib.auth.models import User, Group


class UserMoviesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserMovie
        fields = '__all__'


class MovieRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = '__all__'


class MovieSerializer(serializers.ModelSerializer):
    Ratings_set = MovieRatingSerializer(many=True, read_only=True)
    class Meta:
        model = Movie
        fields = [field.name for field in model._meta.fields]
        fields.append('Ratings_set')
        read_only_fields = ['Ratings_set']


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'


class QuizSerializer(serializers.ModelSerializer):
    Questions_set = MovieRatingSerializer(many=True, read_only=True)
    class Meta:
        model = Quiz
        fields = [field.name for field in model._meta.fields]
        fields.append('Questions_set')
        read_only_fields = ['Questions_set']


class UserQuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserQuiz
        fields = '__all__'


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']