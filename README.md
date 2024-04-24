=== Introduction ====
1. This is a demo project for react front-end and django backend.
2. Front end will grap the data from Quiz and show the list of records to public. When user logs in, he/she is able to create quiz and check his/her own quiz 
list and able to show/delete them.


==== For front end boot up ====
1. cd  react_front_end
2.  npm install --legacy-peer-deps
3. update .env file, change to http://127.0.0.1:8000
4.  npm start 
5. server is booted up at http://127.0.0.1:3000

==== For backend boot up ====
1. cd django_backend
2. python -mvenv venv
3. source venv/bin/activate
4. pip install -r requirements.txt
5. python manage.py runserver
6. server is booted up at http://127.0.0.1:8000


==== For cli tool cli.py will get questions from opentdb. ===
1. python cli.py --help
2. python cli.py -X POST [-t <title>]  [-u <useremail>:<pasword>]


=== Test Result ===
1. Tested Mac OS 10.13.6 successfully

