// // app/api/upload/route.js
// import formidable from "formidable";
// import fs from "fs";
// import path from "path";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// const uploadDir = path.join(process.cwd(), "public/uploads");

// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// export async function POST(req) {
//   const form = new formidable.IncomingForm();

//   form.uploadDir = uploadDir;
//   form.keepExtensions = true;

//   return new Promise((resolve, reject) => {
//     form.parse(req, (err, fields, files) => {
//       if (err) {
//         return resolve(
//           new Response(
//             JSON.stringify({
//               error: "Something went wrong during the upload.",
//             }),
//             { status: 500 }
//           )
//         );
//       }

//       const fileUploadPromises = Object.values(files.files).map((file) => {
//         const oldPath = file.filepath;
//         const newPath = path.join(uploadDir, file.originalFilename);

//         return new Promise((resolve, reject) => {
//           fs.rename(oldPath, newPath, (err) => {
//             if (err) {
//               reject("Failed to save the file.");
//             } else {
//               resolve(newPath);
//             }
//           });
//         });
//       });

//       Promise.all(fileUploadPromises)
//         .then(() => {
//           resolve(
//             new Response(
//               JSON.stringify({ message: "Files uploaded successfully" }),
//               { status: 200 }
//             )
//           );
//         })
//         .catch((error) => {
//           resolve(new Response(JSON.stringify({ error }), { status: 500 }));
//         });
//     });
//   });
// }
