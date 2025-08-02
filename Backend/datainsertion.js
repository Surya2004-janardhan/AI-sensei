// const mongoose = require("mongoose");
// const WordOfTheDay = require("./models/WordOfTheDay");

// // Your Japanese words and sentences arrays here:
// const words = [
//   { word: "ありがとう", meaning: "Thank you" },
//   { word: "さようなら", meaning: "Goodbye" },
//   { word: "こんにちは", meaning: "Hello / Good afternoon" },
//   { word: "おはよう", meaning: "Good morning" },
//   { word: "すみません", meaning: "Excuse me / Sorry" },
//   { word: "お願いします", meaning: "Please (request)" },
//   { word: "はい", meaning: "Yes" },
//   { word: "いいえ", meaning: "No" },
//   { word: "大丈夫", meaning: "I'm okay / It's fine" },
//   { word: "分かりました", meaning: "Understood" },
//   { word: "助けて", meaning: "Help me" },
//   { word: "名前", meaning: "Name" },
//   { word: "家", meaning: "House / Home" },
//   { word: "友達", meaning: "Friend" },
//   { word: "学校", meaning: "School" },
//   { word: "先生", meaning: "Teacher" },
//   { word: "猫", meaning: "Cat" },
//   { word: "犬", meaning: "Dog" },
//   { word: "食べ物", meaning: "Food" },
//   { word: "飲み物", meaning: "Drink" },
//   { word: "水", meaning: "Water" },
//   { word: "電車", meaning: "Train" },
//   { word: "車", meaning: "Car" },
//   { word: "駅", meaning: "Station" },
//   { word: "時間", meaning: "Time" },
//   { word: "今日", meaning: "Today" },
//   { word: "明日", meaning: "Tomorrow" },
//   { word: "昨日", meaning: "Yesterday" },
//   { word: "天気", meaning: "Weather" },
//   { word: "本", meaning: "Book" },
//   { word: "映画", meaning: "Movie" },
//   { word: "音楽", meaning: "Music" },
//   { word: "電話", meaning: "Telephone" },
//   { word: "携帯", meaning: "Cell phone" },
//   { word: "仕事", meaning: "Work / Job" },
//   { word: "休み", meaning: "Holiday / Rest" },
//   { word: "家族", meaning: "Family" },
//   { word: "旅行", meaning: "Travel" },
//   { word: "海", meaning: "Sea / Ocean" },
//   { word: "山", meaning: "Mountain" },
//   { word: "空", meaning: "Sky" },
//   { word: "火", meaning: "Fire" },
//   { word: "水曜日", meaning: "Wednesday" },
//   { word: "朝ご飯", meaning: "Breakfast" },
//   { word: "昼ご飯", meaning: "Lunch" },
//   { word: "晩ご飯", meaning: "Dinner" },
//   { word: "買い物", meaning: "Shopping" },
//   { word: "病院", meaning: "Hospital" },
//   { word: "庭", meaning: "Garden" },
//   { word: "子供", meaning: "Child" },
//   { word: "先生", meaning: "Teacher" },
// ];

// const sentences = [
//   { sentence: "おはようございます。", meaning: "Good morning." },
//   {
//     sentence: "今日はいい天気ですね。",
//     meaning: "The weather is nice today, isn't it?",
//   },
//   {
//     sentence: "すみません、これはいくらですか？",
//     meaning: "Excuse me, how much is this?",
//   },
//   {
//     sentence: "私は日本語を勉強しています。",
//     meaning: "I am studying Japanese.",
//   },
//   { sentence: "この本は面白いです。", meaning: "This book is interesting." },
//   {
//     sentence: "明日、友達と映画を見に行きます。",
//     meaning: "Tomorrow, I will go to see a movie with my friend.",
//   },
//   { sentence: "コーヒーを飲みたいです。", meaning: "I want to drink coffee." },
//   { sentence: "どこに行きますか？", meaning: "Where are you going?" },
//   { sentence: "駅はどこですか？", meaning: "Where is the station?" },
//   { sentence: "仕事は忙しいです。", meaning: "Work is busy." },
//   {
//     sentence: "日本の食べ物は美味しいです。",
//     meaning: "Japanese food is delicious.",
//   },
//   { sentence: "犬が好きですか？", meaning: "Do you like dogs?" },
//   { sentence: "今日は疲れました。", meaning: "I am tired today." },
//   {
//     sentence: "庭で花を育てています。",
//     meaning: "I grow flowers in my garden.",
//   },
//   { sentence: "彼は教師です。", meaning: "He is a teacher." },
//   { sentence: "昨日は雨が降りました。", meaning: "It rained yesterday." },
//   { sentence: "旅行は楽しかったです。", meaning: "The trip was fun." },
//   {
//     sentence: "明日の予定はありますか？",
//     meaning: "Do you have plans for tomorrow?",
//   },
//   {
//     sentence: "この映画は面白くないです。",
//     meaning: "This movie is not interesting.",
//   },
//   { sentence: "携帯電話を忘れました。", meaning: "I forgot my cell phone." },
//   {
//     sentence: "好きな音楽は何ですか？",
//     meaning: "What kind of music do you like?",
//   },
//   {
//     sentence: "子供たちは公園で遊んでいます。",
//     meaning: "Children are playing in the park.",
//   },
//   {
//     sentence: "私は毎日日本語を話します。",
//     meaning: "I speak Japanese every day.",
//   },
//   { sentence: "電車が遅れています。", meaning: "The train is delayed." },
//   { sentence: "これをください。", meaning: "Please give me this." },
//   { sentence: "今日はとても暑いです。", meaning: "It is very hot today." },
//   {
//     sentence: "休みの日に何をしますか？",
//     meaning: "What do you do on your day off?",
//   },
//   {
//     sentence: "友達と買い物に行きます。",
//     meaning: "I will go shopping with my friends.",
//   },
//   { sentence: "猫が好きです。", meaning: "I like cats." },
//   {
//     sentence: "週末に映画館に行きます。",
//     meaning: "I will go to the cinema on the weekend.",
//   },
//   { sentence: "仕事は楽しいです。", meaning: "Work is enjoyable." },
//   {
//     sentence: "家族と一緒にご飯を食べます。",
//     meaning: "I eat meals with my family.",
//   },
//   { sentence: "朝ご飯を食べましたか？", meaning: "Did you eat breakfast?" },
//   {
//     sentence: "天気予報を見ました。",
//     meaning: "I watched the weather forecast.",
//   },
//   { sentence: "車を運転できますか？", meaning: "Can you drive a car?" },
//   { sentence: "新しい友達ができました。", meaning: "I made a new friend." },
//   {
//     sentence: "週に三回スポーツをします。",
//     meaning: "I play sports three times a week.",
//   },
//   { sentence: "本を読むのが好きです。", meaning: "I like reading books." },
//   { sentence: "水を飲みます。", meaning: "I drink water." },
//   { sentence: "電気を消してください。", meaning: "Please turn off the light." },
//   { sentence: "この場所は静かです。", meaning: "This place is quiet." },
//   {
//     sentence: "学校はもうすぐ終わります。",
//     meaning: "School will be over soon.",
//   },
//   { sentence: "明日は休みです。", meaning: "Tomorrow is a holiday." },
//   { sentence: "写真を撮りましょう。", meaning: "Let's take a photo." },
//   { sentence: "ケーキを作りました。", meaning: "I made a cake." },
//   { sentence: "兄は医者です。", meaning: "My older brother is a doctor." },
//   {
//     sentence: "姉は大学生です。",
//     meaning: "My older sister is a college student.",
//   },
//   { sentence: "夏は暑いです。", meaning: "Summer is hot." },
// ];
// // MONGO_URI = mongodb+srv://surya:surya@cluster0.g4rivm3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

// async function insertWordOfTheDay() {
//   try {
//     await mongoose.connect("mongodb+srv://surya:surya@cluster0.g4rivm3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     // Remove existing document(s) if needed
//     await WordOfTheDay.deleteMany({});

//     const doc = new WordOfTheDay({ words, sentences });
//     await doc.save();

//     console.log("WordOfTheDay document inserted successfully!");
//     process.exit(0);
//   } catch (error) {
//     console.error("Error inserting document:", error);
//     process.exit(1);
//   }
// }

// insertWordOfTheDay();

// printSavedDocuments();


const mongoose = require("mongoose");
const WordOfTheDay = require("./models/WordOfTheDay");

async function printSavedDocuments() {
  try {
    await mongoose.connect(
      "mongodb+srv://surya:surya@cluster0.g4rivm3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );

    const docs = await WordOfTheDay.find({});

    if (docs.length === 0) {
      console.log("No documents found");
    } else {
      docs.forEach((doc, index) => {
        console.log(`--- Document ${index + 1} ---`);
        console.log("Words:", doc.words);
        console.log("Sentences:", doc.sentences);
        console.log("Created At:", doc.createdAt);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error("Error fetching documents:", error);
    process.exit(1);
  }
}

printSavedDocuments();
