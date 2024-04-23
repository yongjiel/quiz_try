
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.models import User, Group
from .models import Movie, Rating, UserMovie, Quiz, Question
from .serializers import (MovieSerializer, MovieRatingSerializer,
                         UserSerializer, GroupSerializer, UserMoviesSerializer,
                        QuizSerializer, QuestionSerializer, QuizSummarySerializer)
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


class UserMoviesApiView(APIView):
    # permission_classes = [permissions.IsAuthenticated]
    # authentication_classes = (JWTAuthentication,TokenAuthentication,SessionAuthentication)
    serializer_class = MovieSerializer

    def get(self, request, *args, **kwargs):
        user = _get_user_by_token(request)
        print(user.id)
        uvs = UserMovie.objects.filter(user=user).all()
        print([uv.movie for uv in uvs])
        mvs = [{"imdbID": uv.movie.imdbID, "Title": uv.movie.Title, 
                    "Year": uv.movie.Year} for uv in uvs]
        #serializer = MovieSerializer(mvs, many=True)
        return Response(mvs, status=status.HTTP_200_OK)

class MovieRatingsApiView(APIView):
    # permission_classes = [permissions.IsAuthenticated]
    # authentication_classes = (JWTAuthentication, TokenAuthentication,SessionAuthentication)
    serializer_class = MovieRatingSerializer

    def get(self, request, *args, **kwargs):
        ratings = Rating.objects.all()
        ratings = Rating.objects.all()
        serializer = MovieRatingSerializer(ratings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class MoviesApiView(APIView):
    # permission_classes = [permissions.IsAuthenticated]
    # authentication_classes = (JWTAuthentication, TokenAuthentication,SessionAuthentication)
    serializer_class = MovieSerializer

    def get(self, request, id=None):
        if id:
            try:
                movie = Movie.objects.get(imdbID=id)
                setattr(movie, 'Ratings_set', movie.ratings.all())
                serializer = MovieSerializer(movie)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Exception as e:
                return Response(str(e), status=status.HTTP_404_NOT_FOUND)

        movies = Movie.objects.all()
        for m in movies:
            setattr(m, 'Ratings_set', m.ratings.all())
        serializer = MovieSerializer(movies, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        data = request.data
        print(data)
        m = None
        serializer = MovieSerializer(data=data)
        m = Movie.objects.filter(imdbID=data['imdbID']).first()
        if not m:
            if serializer.is_valid():
                m = serializer.save()
            else:
                print(serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            if 'Ratings' in data:
                for r in data['Ratings']:
                    try:
                        Rating.objects.create(Source=r['Source'], Value=r['Value'], movie=m)
                    except Exception as e:
                        return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

        user = _get_user_by_token(request)
        uv = UserMovie.objects.filter(user=user, movie=m).first()
        if not uv:
            try:
                UserMovie.objects.create(user=user, movie=m)
            except Exception as e:
                print(str(e))
                return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

        serializer = MovieSerializer(m)
        print(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def delete(self, request, id, *args, **kwargs):
        if not id:
            return Response("id must be defined.", status=status.HTTP_400_BAD_REQUEST)
        
        movie = Movie.objects.filter(imdbID=id).first()
        if not movie:
            return Response(None, status=204)
        user = _get_user_by_token(request)
        uv = UserMovie.objects.filter(user=user, movie=movie).first()
        if uv:
            uv.delete()
        else:
            print("No userlist {} {} exists".format(user.id, movie.imdbID))
            #return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
        movie.delete()
        return Response(None, status=204)


class QuizApiView(APIView):
    serializer_class = QuizSerializer

    def get(self, request, permalink=None):
        user = _get_user_by_token(request)
        print("////////")
        print(user, permalink)
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
    
    def delete(self, request, id, *args, **kwargs):
        user = _get_user_by_token(request)
        if not user:
            return Response("user must log in first", status=status.HTTP_400_BAD_REQUEST)
        if not id:
            return Response("id must be defined.", status=status.HTTP_400_BAD_REQUEST)
        
        if user.username == 'admin':
            qz = Quiz.objects.filter(Id=id).first()
        else:
            qz = Quiz.objects.filter(Id=id, user=user).first()

        if not qz:
            return Response(None, status=204)

        # delete questions first
        _delete_quiz_questions(id)
        # finally delete quiz record
        qz.delete()
        return Response({"message": f"Quiz {id} is deleted"}, status=204)


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
