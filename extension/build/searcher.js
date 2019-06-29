"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
function searcher(token) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (token) {
            case "foo":
                return "https://joinpromise.com/assets/media/Measure_Efficacy.svg";
            case "bar":
                return "https://payticket.io/static/images/logos/epa_logo.jpg";
            case "shipit":
                return "https://media.giphy.com/media/79qf1N4RJtc8o/giphy.gif";
            default:
                return null;
        }
    });
}
exports.default = searcher;
