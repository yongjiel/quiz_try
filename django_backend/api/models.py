from django.db import models
from django.contrib.auth.models import User


class Quiz(models.Model):
    '''A quiz consists of a quiz title and a list of questions.'''
    Id = models.AutoField(primary_key=True)
    Title = models.CharField(max_length = 256)
    permalink = models.CharField(max_length = 64)
    user = models.ForeignKey(User, on_delete = models.CASCADE, related_name='quiz') 


class Question(models.Model):
    Id = models.AutoField(primary_key=True)
    # Type = models.CharField(max_length = 180)
    # Difficulty = models.CharField(max_length = 180)
    # Category = models.CharField(max_length = 25)
    Question = models.CharField(max_length = 30)
    Answer1 = models.CharField(max_length = 256)
    Answer2 = models.CharField(max_length = 256)
    Answer3 = models.CharField(max_length = 256)
    Answer4 = models.CharField(max_length = 256)
    Answer5 = models.CharField(max_length = 256)
    CorrectAnswer1 = models.CharField(max_length = 256)
    CorrectAnswer2 = models.CharField(max_length = 256)
    CorrectAnswer3 = models.CharField(max_length = 256)
    CorrectAnswer4 = models.CharField(max_length = 256)
    CorrectAnswer5 = models.CharField(max_length = 256)
    quiz = models.ForeignKey(Quiz, on_delete = models.CASCADE, to_field='Id', related_name='questions')
    
