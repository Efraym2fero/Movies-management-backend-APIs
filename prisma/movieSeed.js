import "dotenv/config"
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";


const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({adapter});

const creatorID = "5ea54d27-3905-416f-bef1-f04fc52c790c"

const movies = [
  {
    "title": "Inception",
    "overview": "A skilled thief leads a team into people's dreams to steal and plant ideas.",
    "realeseYear": 2010,
    "genre": ["Sci-Fi", "Action", "Thriller"],
    "runtime": 148,
    "createdBy": creatorID
  },
  {
    "title": "Interstellar",
    "overview": "A team travels through a wormhole in space to ensure humanity's survival.",
    "realeseYear": 2014,
    "genre": ["Sci-Fi", "Drama", "Adventure"],
    "runtime": 169,
    "createdBy": creatorID
  },
  {
    "title": "The Dark Knight",
    "overview": "Batman faces the Joker, a criminal mastermind who plunges Gotham into chaos.",
    "realeseYear": 2008,
    "genre": ["Action", "Crime", "Drama"],
    "runtime": 152,
    "createdBy": creatorID
  },
  {
    "title": "Batman Begins",
    "overview": "Bruce Wayne begins his journey to become Batman and fight crime in Gotham.",
    "realeseYear": 2005,
    "genre": ["Action", "Adventure"],
    "runtime": 140,
    "createdBy": creatorID
  },
  {
    "title": "The Dark Knight Rises",
    "overview": "Batman returns to face Bane and save Gotham City from destruction.",
    "realeseYear": 2012,
    "genre": ["Action", "Drama"],
    "runtime": 164,
    "createdBy": creatorID
  },
  {
    "title": "Dunkirk",
    "overview": "Allied soldiers are evacuated during WWII from the beaches of Dunkirk.",
    "realeseYear": 2017,
    "genre": ["War", "Drama", "History"],
    "runtime": 106,
    "createdBy": creatorID
  },
  {
    "title": "Tenet",
    "overview": "An agent manipulates time to prevent World War III.",
    "realeseYear": 2020,
    "genre": ["Sci-Fi", "Action"],
    "runtime": 150,
    "createdBy": creatorID
  },
  {
    "title": "Memento",
    "overview": "A man with short-term memory loss tries to find his wife's killer.",
    "realeseYear": 2000,
    "genre": ["Mystery", "Thriller"],
    "runtime": 113,
    "createdBy": creatorID
  },
  {
    "title": "The Prestige",
    "overview": "Two magicians engage in a fierce rivalry filled with obsession and deception.",
    "realeseYear": 2006,
    "genre": ["Drama", "Mystery", "Sci-Fi"],
    "runtime": 130,
    "createdBy": creatorID
  },
  {
    "title": "Oppenheimer",
    "overview": "The story of J. Robert Oppenheimer and the creation of the atomic bomb.",
    "realeseYear": 2023,
    "genre": ["Biography", "Drama", "History"],
    "runtime": 180,
    "createdBy": creatorID
  }
]

const main = async ()=>{
    console.log("seeding movies......")
    for (const m of movies)
    {
        await prisma.movie.create({
            data:m
        })
        console.log(`created movie : ${m.title}`)     
    }
    console.log("seeding completed")
}

main()
.catch((err)=>
    {
        console.error(err)
        process.exit(1)
    })
.finally(async()=>{
    prisma.$disconnect()
})
