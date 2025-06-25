** System Requirements needed on the PC:
Python 3.10+ (download install on the pc. "pip" also comes with it by default. So, no need to install pip) 
MySQL (via XAMPP or standalone) (install XAMPP)
FastAPI (no need to install separately, already there in requirements.txt)
VS Code or any Python IDE (Install)

A. Set up the system with backend:

1. Open the fashion360-eai folder in any IDM (e.g., VS Code).
2. After opening it, go to the Terminal section to send the commands. Check the installed python version first by running "python --version". Then, run "pip --version" to check the version of pip.
3. Currently the directory might be on for example ABC folder. So, write "CD fashion360-eai" to go to the fashion360-eai folder inside the ABC folder. 
Now there are several folders inside the fashion360-eai. You can run the "ls" command to see all others folders. 
Currently there are like .sql folder, frontend folder and another fashion360-eai folder which is the backend folder of this system. 
So, again type "CD fashion360-eai" to go inside the fashion360-eai backend folder. 
Now we're inside the ABC\fashion360-eai\fashion360-eai directory and can proceed to run the necessary commands for the project. 
Note: to go back one directory back, run "CD ..".
4. Now write the following command to install all the dependencies listed in the requirements.txt file. The command is "pip install -r requirements.txt". 
Then write "pip list" to see if all the required dependencies are installed or not. If any of them are not installed than we have to install all of them by opening a Command Prompt or CMD(Rus As Administrator) and type the "pip install -r requirements.txt" to download and install all of them. 
Or, we can do it on where we were doing it previously in VS code. But we have to install all dependencies one by one on there. For example, "pip install Flask" or "pip install pymysql" etc.
5. After all the dependencies successfully installed, now run "uvicorn app.main:app --reload" to start the backend of the system. 
After running, the FastAPI backend is now running and waiting for requests. Visit http://127.0.0.1:8000 in your browser to see your app. 
Also, you can open http://127.0.0.1:8000/health in your browser to check if the backend is healthy. Finally, you can open http://127.0.0.1:8000/docs to see the FastAPI documentation.

B: connect your database using XAMPP (phpMyAdmin/MySQL):

1. Open XAMPP Control Panel software
2. Start Apache and then MySQL in XAMPP
3. click on "Admin" button beside the Start button of MySQL to open phpMyAdmin. Or, can Open http://localhost/phpmyadmin in your browser.
4. Now, import your SQL file into the phpMyAdmin. For that, click on "New" on the left column of the database section in phpMyAdmin. Create a new database (e.g., fashion360).
 Go to the Import tab, select fashion.sql file, and import it. Then, click on "Structure" to see all the tables.

C. Now, need to update the FastAPI backend to use this database:

In the project folder inside VS code, open the .env file (in the fashion360-eai directory).
Set the database URL, for example "DATABASE_URL=mysql+pymysql://root:@localhost:3306/fashion360". (this is if you don't set any password on it. Replace root with your MySQL username but default is root and blank password. So might not need to change anything here. 
Again, fashion360 is the database name you created in phpMyAdmin).
But if you want to set up a password, then "DATABASE_URL=mysql+pymysql://root:password@localhost:3306/fashion360". Replace "password" with your password.
So, now the backend is connected with the database.


3. How to run the frontend:

The frontend is in the fashion360-frontend folder which is index.html.
You can open the HTML files directly in a browser. The frontend will make API calls to your backend at http://127.0.0.1:8000.

** How everything works together:
Backend (FastAPI): Handles API requests, talks to the MySQL database.
Database (MySQL/XAMPP): Stores your data, accessed by the backend.
Frontend (HTML/JS): Runs in your browser, talks to the backend via API.

