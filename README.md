## Students face doubts while studying.

Instructions
----------------------------------
Create .env file in the root directory of the project add  ``HOST``, ``PORT``, ``DATABASE_URL``

        HOST=localhost
        PORT=8083
        DATABASE_URL=mongodb://localhost:27017/assignment
        BUGSNAG_API_KEY=akjsdl327t


----
Useful commands

- Install node dependencies.
               
        npm install
        
- Seed assets data: saving json data in Database and adding ``_id``, ``created_at``, ``updated_at``, ``is_deleted`` keys in file after inserting in DB.
                
        npm run seed

- Run Application

       npm run dev
       or 
       npm run start
       
- Debug Application

        npm run debug

- Application production build

       npm run build
    
RESTAPI Docs
----------------------------------
# Endpoints

[1) User](src/docs/User.md)

[2) Download PDF](src/docs/DownloadPDF.md)

[3) User Asked Questions](src/docs/AskedQuestions.md)

[4) Catalog Questions](src/docs/CatalogQuestions.md)
