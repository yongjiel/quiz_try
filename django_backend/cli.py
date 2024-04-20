#!/usr/bin/env python
"""Cli side for load from opentdb.com, Get from local db, delete from 
   local db.

Usage:
    cli.py [options]
    cli.py -X GET
    cli.py -X GET -i 10
    cli.py -X POST -t title
    cli.py -X DELETE -i 10

Options:
    -h, --help
    -X --action action  Cli action, GET|POST|DELETE [default: 'GET']
    -i --id id          quiz id.
    -t --title title    Title of quiz

"""
from docopt import docopt

import pprint
import requests
from requests.auth import  HTTPDigestAuth
import sys


URL = "https://opentdb.com/api.php?amount=10"
LOCAL_DJANGO_SERVER = 'http://localhost:8000'
LOCAL_DJANGO_SERVER_QUIZ_API= f'{LOCAL_DJANGO_SERVER}/api/quizs/'


def get_back_data_from_remote_url():
    try:
        r = requests.get(URL)
    except Exception as e:
        print(str(e))
        sys.exit(-1)
    else:
        return r.json()['results']
    

def get_token_from_django_server():
    url = f'{LOCAL_DJANGO_SERVER}/api/token/?format=json'
    try:
        r = requests.post(url, {'username':'admin', 'password':'admin'})
    except Exception as e:
        print(str(e))
        sys.exit(-1)
    else:
        return r.json()['access']


def post_quiz(r_json, token, title=None):
    tmp = []
    for q in r_json:
        # print("{} , {}, {}".format(q['question'], q['correct_answer'], 
        #                         q['incorrect_answers']))
        post_questions = {}
        post_questions['question']=  q['question']
        post_questions['CorrectAnswer1']=  q['correct_answer']
        post_questions['CorrectAnswer2']=  ''
        post_questions['CorrectAnswer3']=  ''
        post_questions['CorrectAnswer4']=  ''
        post_questions['CorrectAnswer5']=  ''
        post_questions['Answer1']=  q['correct_answer']
        if q['incorrect_answers']:
            for i in range(len(q['incorrect_answers'])):
                count = i+2
                post_questions['Answer' + str(count)]=  q['incorrect_answers'][i]
        if 'Answer2' not in post_questions:
            post_questions['Answer2']= ''
        if 'Answer3' not in post_questions:
            post_questions['Answer3']= ''
        if 'Answer4' not in post_questions:
            post_questions['Answer4']= ''
        if 'Answer5' not in post_questions:
            post_questions['Answer5']= ''
        tmp.append(post_questions)

    data = {'Questions': tmp}
    data['Title'] = title if title else 'From https://opentdb.com/'
    #pprint.pprint(data)
    try:
        r = requests.post(LOCAL_DJANGO_SERVER_QUIZ_API,
                        json = data,
                        headers={'Authorization': "Bearer {}".format(token)})
    except Exception as e:
        print(str(e))
        sys.exit(-1)
    else:
        return r.json()


def get_all_quizs(token):
    try:
        r = requests.get(LOCAL_DJANGO_SERVER_QUIZ_API,
                        headers={'Authorization': "Bearer {}".format(token)})
    except Exception as e:
        print(str(e))
        sys.exit(-1)
    else:
        pprint.pprint( r.json() )


def get_quiz(id, token):
    
    url = LOCAL_DJANGO_SERVER_QUIZ_API + str(id)
    try:
        r = requests.get(url,
                        headers={'Authorization': "Bearer {}".format(token)})
    except Exception as e:
        print(str(e))
        sys.exit(-1)
    else:
        pprint.pprint( r.json() )


def delete_quiz(id, token):
    url = LOCAL_DJANGO_SERVER_QUIZ_API + str(id)
    try:
        r = requests.delete(url,
                        headers={'Authorization': "Bearer {}".format(token)})
    except Exception as e:
        print(str(e))
        sys.exit(-1)
    else:
        return r


def main(args):
    token = get_token_from_django_server()
    if args['--action'] == 'DELETE':
        resp = delete_quiz(int(args['--id']), token)
    elif args['--action'] == 'POST':
        r_json = get_back_data_from_remote_url()
        resp = post_quiz(r_json, token, args['--title'])
    elif args['--action'] == 'GET':
        if '--id' in args and args['--id']:
            get_quiz(int(args['--id']), token)
        else:
            get_all_quizs(token)


if __name__=='__main__':
    args = docopt(__doc__)
    #print(args)
    main(args)
