import Course from '../models/Course.js';

import fs from 'fs';
const dataRaw = fs.readFileSync('../Data.json', 'utf8');
const dataImport = JSON.parse(dataRaw);
const data = dataImport["Table 1"];
// console.log();

const filteredData = data.map(item => {
    console.log(item);
    
    return ({

    name: item["Course Title"],
    code24: item["Course Code R2024"],
    code19: item["Course Code R2019"],
    credits: item["Total Credits"],
    category: item["Category"]
})});


// // Function to insert into MongoDB
// async function insertCourses() {
//     try {
//         // Transform filteredData to match the model (using code19 as code)
//         const coursesToInsert = filteredData.map(item => ({
//             name: item.name,
//             code19: item.code19,
//             code24: item.code24,
//             credits: item.credits,
//             category: item.category
//         }));

//         // Insert many
//         const insertedCourses = await Course.insertMany(coursesToInsert);
//         console.log('Inserted courses:', insertedCourses);
//     } catch (error) {
//         console.error('Error inserting courses:', error);
//     }
// }

fs.writeFileSync('courses.json', JSON.stringify(filteredData, null, 2), 'utf8');
console.log('Generated courses.json successfully');

// insertCourses();
