import multer, { Options } from "multer";
import bcryptjs from "bcryptjs";
import path from "path";

export default{
    //Definindo o destino e o nome do arquivo
    storage: multer.diskStorage({
        destination: path.join(__dirname, "..", "..", "uploads"),
        filename: async (req, file, callback) => {
            const fileHash = await bcryptjs.genSalt(15);
            const filename = `${fileHash}-${file.originalname}`;

            return callback(null, filename);
        },
    }),
    //Definindo o limite do arquivo (Validação a mais)
    limits:{
        fileSize: 8 * 1024 * 1024, //8MB
    },
    //Defininfo o tipo de arquivo aceitável (Validação a mais)
    fileFilter: (req, file, callback) => {
        const mineType = ["image/png", "image/jpeg", "image/gif", "image/jpg"];

        if (!mineType.includes(file.mimetype)) {
            return callback(null, false);
        }

        return callback(null, true);
    },
} as Options