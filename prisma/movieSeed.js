import "dotenv/config"
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";


const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({adapter});

const creatorID = "50c9b947-51eb-4617-831a-68fe082ee859"

const movies = [
  {
    "title": "Pulp Fiction",
    "overview": "Interwoven stories of crime, redemption, and dark humor in Los Angeles.",
    "realeseYear": 1994,
    "genre": ["Crime", "Drama"],
    "runtime": 154,
    "posterURL": "https://example.com/pulpfiction.jpg",
    "createdBy": creatorID
  },
  {
    "title": "Reservoir Dogs",
    "overview": "After a failed heist, criminals suspect one of them is a police informant.",
    "realeseYear": 1992,
    "genre": ["Crime", "Thriller"],
    "runtime": 99,
    "posterURL": "https://example.com/reservoirdogs.jpg",
    "createdBy": creatorID
  },
  {
    "title": "Kill Bill: Vol. 1",
    "overview": "A former assassin seeks revenge against her ex-colleagues who betrayed her.",
    "realeseYear": 2003,
    "genre": ["Action", "Crime"],
    "runtime": 111,
    "posterURL": "https://example.com/killbill1.jpg",
    "createdBy": creatorID
  },
  {
    "title": "Kill Bill: Vol. 2",
    "overview": "The Bride continues her revenge quest, confronting the remaining targets.",
    "realeseYear": 2004,
    "genre": ["Action", "Drama"],
    "runtime": 136,
    "posterURL": "https://example.com/killbill2.jpg",
    "createdBy": creatorID
  },
  {
    "title": "Inglourious Basterds",
    "overview": "A group of Jewish soldiers plots to assassinate Nazi leaders during WWII.",
    "realeseYear": 2009,
    "genre": ["War", "Drama"],
    "runtime": 153,
    "posterURL": "https://example.com/inglouriousbasterds.jpg",
    "createdBy": creatorID
  },
  {
    "title": "Django Unchained",
    "overview": "A freed slave teams up with a bounty hunter to rescue his wife.",
    "realeseYear": 2012,
    "genre": ["Western", "Drama"],
    "runtime": 165,
    "posterURL": "https://example.com/django.jpg",
    "createdBy": creatorID
  },
  {
    "title": "The Hateful Eight",
    "overview": "Strangers seek shelter during a blizzard but tensions escalate into violence.",
    "realeseYear": 2015,
    "genre": ["Western", "Mystery"],
    "runtime": 168,
    "posterURL": "https://example.com/hateful8.jpg",
    "createdBy": creatorID
  },
  {
    "title": "Once Upon a Time in Hollywood",
    "overview": "A fading actor and his stunt double navigate Hollywood's changing landscape.",
    "realeseYear": 2019,
    "genre": ["Drama", "Comedy"],
    "runtime": 161,
    "posterURL": "https://example.com/oncehollywood.jpg",
    "createdBy": creatorID
  },
  {
    "title": "Jackie Brown",
    "overview": "A flight attendant becomes entangled in a dangerous money smuggling scheme.",
    "realeseYear": 1997,
    "genre": ["Crime", "Drama"],
    "runtime": 154,
    "posterURL": "https://example.com/jackiebrown.jpg",
    "createdBy": creatorID
  },
  {
    "title": "Death Proof",
    "overview": "A stuntman uses his car to stalk and kill unsuspecting women.",
    "realeseYear": 2007,
    "genre": ["Thriller", "Action"],
    "runtime": 113,
    "posterURL": "https://example.com/deathproof.jpg",
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
