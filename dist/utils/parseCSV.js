"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCSV = void 0;
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const parseCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const products = [];
        fs_1.default.createReadStream(filePath)
            .pipe((0, csv_parser_1.default)())
            .on('data', (row) => {
            // Add each row to the products array
            products.push({
                name: row.name,
                description: row.description,
                category: row.category,
                vendorEmail: row.vendorEmail,
                price: parseFloat(row.price),
                stock: parseInt(row.stock),
                images: row.images,
                ratings: {
                    average: parseFloat(row['ratings.average']),
                    count: parseInt(row['ratings.count']),
                },
                isFeatured: row.isFeatured === 'true',
                isArchived: row.isArchived === 'true',
                salesCount: parseInt(row.salesCount),
                totalRevenue: parseFloat(row.totalRevenue),
                analytics: {
                    views: parseInt(row['analytics.views']),
                    clicks: parseInt(row['analytics.clicks']),
                },
            });
        })
            .on('end', () => resolve(products))
            .on('error', (err) => reject(err));
    });
};
exports.parseCSV = parseCSV;
