from django.db import models
from django.contrib.auth.models import User


class Movie(models.Model):
    Title = models.CharField(max_length = 180)
    Year = models.CharField(max_length = 180)
    Rated = models.CharField(max_length = 25)
    Released = models.CharField(max_length = 30)
    Runtime = models.CharField(max_length = 30)
    Genre = models.CharField(max_length = 50)
    Director = models.CharField(max_length = 100)
    Writer = models.CharField(max_length = 100)
    Actors  = models.CharField(max_length = 300)
    Plot  = models.CharField(max_length = 500)
    Language = models.CharField(max_length = 50)
    Country = models.CharField(max_length = 180)
    Awards = models.CharField(max_length = 180)
    Poster  = models.CharField(max_length = 500)
    Metascore  = models.CharField(max_length = 10)
    imdbRating  = models.CharField(max_length = 10)
    imdbVotes = models.CharField(max_length = 10)
    imdbID = models.CharField(max_length = 30, primary_key=True)
    Type = models.CharField(max_length = 10)
    DVD = models.CharField(max_length = 30)
    BoxOffice = models.CharField(max_length = 30)
    Production = models.CharField(max_length = 30, blank=True, null = True)
    Website = models.CharField(max_length = 30, blank=True, null = True)
    Response = models.CharField(max_length = 30)


class Rating(models.Model):
    Source = models.CharField(max_length = 30)
    Value = models.CharField(max_length = 30)
    movie = models.ForeignKey(Movie, on_delete = models.CASCADE, to_field='imdbID', related_name='ratings')


class UserMovie(models.Model):
    user = models.ForeignKey(User, on_delete = models.CASCADE,)
    movie = movie = models.ForeignKey(Movie, on_delete = models.CASCADE, to_field='imdbID')


class Quiz(models.Model):
    '''A quiz consists of a quiz title and a list of questions.'''
    Id = models.AutoField(primary_key=True)
    Title = models.CharField(max_length = 256)
    permalink = models.CharField(max_length = 32)

'''
"type": "multiple",
"difficulty": "medium",
"category": "Entertainment: Music",
"question": "What is the first track on Kanye West&#039;s 808s &amp; Heartbreak?",
"correct_answer": "Say You Will",
"incorrect_answers": [
"Welcome to Heartbreak",
"Street Lights",
"Heartless"
]'''
class Question(models.Model):
    Id = models.AutoField(primary_key=True)
    # Type = models.CharField(max_length = 180)
    # Difficulty = models.CharField(max_length = 180)
    # Category = models.CharField(max_length = 25)
    Question = models.CharField(max_length = 30)
    Answer1 = models.CharField(max_length = 100)
    Answer2 = models.CharField(max_length = 100)
    Answer3 = models.CharField(max_length = 100)
    Answer4 = models.CharField(max_length = 100)
    Answer5 = models.CharField(max_length = 100)
    CorrectAnswer1 = models.CharField(max_length = 100)
    CorrectAnswer2 = models.CharField(max_length = 100)
    CorrectAnswer3 = models.CharField(max_length = 100)
    CorrectAnswer4 = models.CharField(max_length = 100)
    CorrectAnswer5 = models.CharField(max_length = 128)
    quiz = models.ForeignKey(Quiz, on_delete = models.CASCADE, to_field='Id', related_name='questions')


class UserQuiz(models.Model):
    user = models.ForeignKey(User, on_delete = models.CASCADE, to_field='id')
    quiz = models.ForeignKey(Quiz, on_delete = models.CASCADE, to_field='Id')
