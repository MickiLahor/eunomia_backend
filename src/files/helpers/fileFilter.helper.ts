

export const fileFilter = (req: Express.Request, file: Express.Multer.File, callback: Function ) => {

    if( !file ) return callback(new Error('Archivo vacio'),false);

    const fileExtension = file.mimetype.split('/')[1];
    const validExtensions = ['pdf'];

    if( validExtensions.includes( fileExtension ) ) {
        return callback(null,true);
    }

    callback(null,false)
}