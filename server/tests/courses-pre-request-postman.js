/* Script to populate database with random data through Postman CRUD requests,
using Pre-request Script with variables. */


const topics = [
    "JavaScript", "Python", "Data Science", "Machine Learning", "Web Development",
    "Mobile Development", "Cybersecurity", "Cloud Computing", "Artificial Intelligence",
    "DevOps", "Knitting", "History", "Public Speaking", "Theology", "Social Science",
    "Psycology", "Roman Empire", "Project Management", "Crochet", "Handicraft", "Art",
    "Drawing", "Architecture", "Medicine", "Economy"
];

const difficulties = ["Beginner", "Advanced", "Expert"];
const releaseYears = [2020, 2021, 2022, 2023, 2024];

const providers = [
    "Coursera", "Pluralsight", "Udemy", "Udacity", "FutureLearn", "Skillshare",
    "Learning Tree", "edX", "Alison"
];

const yesOrNo = ['Yes', 'No'];

// Randomized numbers
const randomNumber = Math.floor(Math.random() * 10000);
const getRandomElement = function (array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Fit variables to schema for Courses
const randomTopic = [getRandomElement(topics)];
const randomCourseName = `${randomTopic}_${randomNumber}`;
const randomDifficulty = getRandomElement(difficulties);
const loremDescription = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio.";
const randomAverageRating = Number((Math.random() * 4 + 1).toFixed(1));
const randomReleaseYear = Number(getRandomElement(releaseYears));
const randomProvider = getRandomElement(providers);
const randomCertificate = getRandomElement(yesOrNo);
const randomAvailability = randomReleaseYear <= 2022 ? 'No' : 'Yes';

pm.environment.set('randomName', randomCourseName)
pm.environment.set('randomTopic', randomTopic)
pm.environment.set('randomDifficulty', randomDifficulty)
pm.environment.set('description', loremDescription)
pm.environment.set('randomAverageRating', randomAverageRating)
pm.environment.set('randomReleaseYear', randomReleaseYear)
pm.environment.set('randomProvider', randomProvider)
pm.environment.set('randomCertificate', randomCertificate)
pm.environment.set('randomAvailability', randomAvailability)