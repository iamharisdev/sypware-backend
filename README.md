# VS-Spyware-Backend

  
  ## Project Setup

Run this cmd in the root file for install the nodemodules

    npm i

  

## Set your .env

  Set up your environment variables by creating a `.env` file in the root directory. Update the following values:

    DATABASE_URL="YOUR POSTGRES DATABASE URL"
    
    JWT_SECRET=
    
    JWT_EXPIRES_IN=
    
    NODE_ENV=developmen
    
    JWT_COOKIE_EXPIRES_IN=
    
    EMAIL_HOST=
    
    EMAIL_PORT=
    
    EMAIL_USERNAME=
    
    EMAIL_PASSWORD=
    
    PORT =
## Database Migration :
Apply database migrations using Prisma by running the following command:

    npx prisma migrate dev

## Usage :
To start the development server, run the following command

   

     npm run dev
## Contributing
We welcome contributions! If you would like to contribute to this project, please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature/fix: `git checkout -b feature/your-feature-name`
3.  Make your changes and commit them: `git commit -m "Add your commit message"`
4.  Push your changes to your fork: `git push origin feature/your-feature-name`
5.  Create a pull request from your fork to the main repository.
## License
This project is licensed under the [MIT License](https://chat.openai.com/LICENSE).

> Please replace the placeholder values (like
> YOUR_POSTGRES_DATABASE_URL, YOUR_JWT_SECRET, etc.) with actual values
> relevant to your project. Additionally, ensure that the file is named
> `README.md` and is located in the root directory of your project.
