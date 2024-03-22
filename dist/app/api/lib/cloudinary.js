"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImageByIdServer = exports.getImageUrlByIdServer = void 0;
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
    secure: true,
});
function getImageUrlByIdServer(imageId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!imageId || typeof imageId !== 'string')
            return null;
        const image = yield cloudinary_1.v2.api.resource(imageId);
        return image.secure_url;
    });
}
exports.getImageUrlByIdServer = getImageUrlByIdServer;
function deleteImageByIdServer(imageId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!imageId)
            return;
        yield cloudinary_1.v2.uploader.destroy(imageId);
    });
}
exports.deleteImageByIdServer = deleteImageByIdServer;
exports.default = cloudinary_1.v2;
