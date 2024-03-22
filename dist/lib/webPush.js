"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webPush = void 0;
const web_push_1 = __importDefault(require("web-push"));
exports.webPush = web_push_1.default;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
web_push_1.default.setVapidDetails('mailto:hoge@hoge.hoge', process.env.NEXT_PUBLIC_VAPID_PUBLIC, process.env.VAPID_PRIVATE);
