from rest_framework import serializers
from .models import Question, Quiz
from django.contrib.auth.models import User, Group
from rest_framework.validators import UniqueValidator


class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
            required=True,
            validators=[UniqueValidator(queryset=User.objects.all())]
            )
    username = serializers.CharField(
            max_length=256,
            validators=[UniqueValidator(queryset=User.objects.all())]
            ) 
    password = serializers.CharField(min_length=8, write_only=True)

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['email'], validated_data['email'],
             validated_data['password'])
        return user

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'


class QuizSerializer(serializers.ModelSerializer):
    Questions_set = QuestionSerializer(many=True, read_only=True)
    user = UserSerializer(many=False, read_only=True)
    class Meta:
        model = Quiz
        fields = [field.name for field in model._meta.fields]
        fields.append('Questions_set')
        read_only_fields = ['Questions_set']


class QuizSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = '__all__'

