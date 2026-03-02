import fs from 'fs/promises';
import pdfParse from 'pdf-parse';
import mammoth from "mammoth";

const extractText = async (filepath, filemimetype) => {
    try {
        let text = '';
    if (filemimetype === "application/pdf") {
        const bufferData = await fs.readFile(filepath);
        const data = await pdfParse(bufferData);
        text = data.text;
    }
    else if (filemimetype.includes("wordprocessingml.document")) {
        const data = await mammoth.extractRawText({path:filepath});
        text = data.value;
    }
    else if (filemimetype === "text/plain") {
        text = await fs.readFile(filepath,"utf-8");
    }
    else {
        throw new Error("Onlt DOCX, Text, PDF are Allowed")
    }
    return text.replace(/\s+/g, " ").trim();
    } catch (error) {
        console.error(error);
        throw error;
    }   
};


export default extractText;