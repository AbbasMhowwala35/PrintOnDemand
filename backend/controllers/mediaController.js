const fs = require("fs");
const path = require("path");
const Media = require('../models/Media');
const { errorResponse,successResponse } = require('../helpers/responseHelper');


const addMedia = async (req, res) => {
    try {
        if (!req.file) {
            return errorResponse(res, 'File is required', {}, 400);
        }

        // Extract form data
        const { title, download_limit, category_id } = req.body;
        const filepath = req.file.path; // File path from Multer

        // Insert into database
        await Media.query().insert({
            title,
            filepath,
            download_limit,
            category_id
        });
        return successResponse(res, 'Media uploaded successfully!', {}, 201);
    } catch (error) {
        return errorResponse(res, 'Something Went Wrong', { error: error.message }, 500);
    }
};

const getMedia = async (req, res) => {
    try {
        let { page = 1, limit = 10, title,category, sort_by = 'created_at', order = 'desc' } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        const query = Media.query()
            .withGraphFetched("category") // Fetch related category data
            .modifyGraph("category", (builder) => {
                builder.select("id", "name"); // Select only necessary fields from category
            });

        // Filtering by name (if provided)
        if (title) {
            query.where('title', 'like', `%${title}%`);
        }
        if (category) {
            query.where('category_id', '=', category);
        }

        // Sorting (default: descending order by created_at)
        query.orderBy(sort_by, order);

        // Pagination
        const media = await query.page(page - 1, limit);

        return successResponse(res, 'Media fetched successfully', media, 200);
    } catch (error) {
        return errorResponse(res, 'Something went wrong', { error: error.message }, 500);
    }
};

const updateMedia = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, download_limit, category_id } = req.body;
        let newFilePath = req.file ? req.file.path : null;

        // Check if media exists
        const existingMedia = await Media.query().findById(id);
        if (!existingMedia) {
            return errorResponse(res, 'Media not found', {}, 404);
        }

        // If a new file is uploaded, delete the old file
        if (newFilePath && existingMedia.filepath) {
            const oldFilePath = path.join(__dirname, "..", existingMedia.filepath);
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath); // Delete old file
            }
        }

        // Update media record
        const updatedMedia = await Media.query()
            .patchAndFetchById(id, {
                title: title || existingMedia.title,
                filepath: newFilePath || existingMedia.filepath,
                download_limit: download_limit || existingMedia.download_limit,
                category_id: category_id || existingMedia.category_id,
            })
            .withGraphFetched("category")
            .modifyGraph("category", (builder) => {
                builder.select("id", "name");
            });
        return successResponse(res, 'Media updated successfully', updatedMedia, 200);
    } catch (error) {
        return errorResponse(res, 'Something went wrong', { error: error.message }, 500);
    }
};

const deleteMedia = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the media entry
        const media = await Media.query().findById(id);
        if (!media) {
            return errorResponse(res, 'Media not found', {}, 404);
        }

        // Delete the associated file if it exists
        if (media.filepath) {
            const filePath = path.join(__dirname, "..", media.filepath);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath); // Delete the file
            }
        }

        // Delete media from database
        await Media.query().deleteById(id);
        return successResponse(res, 'Media deleted successfully',{}, 200);
    } catch (error) {
        return errorResponse(res, '"Something went wrong', {error: error.message}, 500);
    }
};
module.exports = {addMedia,getMedia,updateMedia,deleteMedia};
