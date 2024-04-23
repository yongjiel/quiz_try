
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.models import User, Group
from .models import  Quiz, Question
from .serializers import (UserSerializer, GroupSerializer,
                        QuizSerializer, QuestionSerializer,
                        QuizSummarySerializer)
import copy
from rest_framework import viewsets
from django.contrib.auth.decorators import permission_required
from django.utils.decorators import method_decorator
from rest_framework.authtoken.models import Token
import random, string


def _get_user_by_token(request):
    print(request)
    if hasattr(request, 'user') and hasattr( request.user, "username"): # simplejwt
        username = request.user.username
        return User.objects.filter(username=username).first()
    if hasattr(request, 'user'):
        return request.user
    if request.META.get('HTTP_AUTHORIZATION', None):
        tok = request.META.get('HTTP_AUTHORIZATION').replace("Token ", "")
        token = Token.objects.get(key=tok)
        return User.objects.get(id=token.user_id)
    else:
        raise Exception("No user/token found.")


class QuizApiView(APIView):
    serializer_class = QuizSerializer

    def get(self, request, permalink=None):
        user = _get_user_by_token(request)
        if permalink:
            try:
                qz = Quiz.objects.get(permalink=permalink)
                setattr(qz, 'Questions_set', qz.questions.all())
                serializer = QuizSerializer(qz, context={'request': request})
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Exception as e:
                return Response(str(e), status=status.HTTP_404_NOT_FOUND)

        qzs = Quiz.objects.filter().all()

        for qz in qzs:
            setattr(qz, 'Questions_set', qz.questions.all())

        serializer = QuizSerializer(qzs, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        data = request.data 
        user = _get_user_by_token(request)
        if not user:
            return Response("user must log in first", status=status.HTTP_400_BAD_REQUEST)
        qz, response_obj = _create_quiz_and_questions_records(data, user)
        if response_obj:
            return response_obj

        serializer = QuizSerializer(qz, context={'request': request,})
        #print(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def delete(self, request, permalink, *args, **kwargs):
        user = _get_user_by_token(request)
        if not user:
            return Response("user must log in first", status=status.HTTP_400_BAD_REQUEST)
        if not permalink:
            return Response("permalink must be defined.", status=status.HTTP_400_BAD_REQUEST)
        
        if user.username == 'admin':
            qz = Quiz.objects.filter(permalink=permalink).first()
        else:
            qz = Quiz.objects.filter(permalink=permalink, user=user).first()

        if not qz:
            return Response(None, status=204)

        # delete questions first
        _delete_quiz_questions(permalink)
        # finally delete quiz record
        qz.delete()
        return Response({"message": f"Quiz {permalink} is deleted"}, status=204)


class QuizSummaryApiView(APIView):
    # permission_classes = [permissions.IsAuthenticated]
    # authentication_classes = (JWTAuthentication, TokenAuthentication,SessionAuthentication)
    serializer_class = QuizSummarySerializer

    def get(self, request):
        user = _get_user_by_token(request)
        if not user or user.username == 'admin':
            qzs = Quiz.objects.filter().all()
        else:
            qzs = Quiz.objects.filter(user=user).all()

        serializer = QuizSummarySerializer(qzs, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


def _delete_quiz_questions(permalink):
    qzs = Quiz.objects.filter(permalink=permalink).all()
    for qz in qzs:
        questions = qz.questions.all()
        for question in questions:
            q = Question.objects.filter(Id=question.Id).first()
            q.delete()


def _create_questions_for_quiz(data, qz):
    if 'Questions' in data:
        for q in data['Questions']:
            try:
                Question.objects.create(Answer1=q['Answer1'], Answer2=q['Answer2'], 
                                        Answer3=q['Answer3'], Answer4=q['Answer4'],
                                        Answer5=q['Answer5'],
                                        CorrectAnswer1=q['CorrectAnswer1'], CorrectAnswer2=q['CorrectAnswer2'], 
                                        CorrectAnswer3=q['CorrectAnswer3'], CorrectAnswer4=q['CorrectAnswer4'],
                                        CorrectAnswer5=q['CorrectAnswer5'],
                                        Question=q['question'],
                                        quiz=qz)
            except Exception as e:
                print(str(e))
                return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
    return None


def _create_quiz_and_questions_records(data, user):
    qz = None
    response_obj = None
    data['permalink'] = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    data['user'] = user
    serializer = QuizSerializer(data=data)
    data_cp = copy.deepcopy(data)
    del data_cp['Questions']
    if serializer.is_valid():
        qz = Quiz.objects.create(**data_cp)
        response_obj = _create_questions_for_quiz(data, qz)
        return qz, response_obj
    else:
        print(serializer.errors)
        response_obj = Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return None, response_obj

    
class UserCreate(APIView):
    """ 
    Creates the user. 
    """

    def post(self, request, format='json'):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                token = Token.objects.create(user=user)
                json = serializer.data
                json['token'] = token.key
                return Response(json, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
