const Category = require('../models/Category');
const { errorResponse,successResponse } = require('../helpers/responseHelper');


const addCategory = async (req, res) => {
    try {
        const {name} = req.body;
        const category = await Category.query().insert({name});
        // Return token in Bearer format
        return successResponse(res, 'Category Added Succesfully', {category}, 200);
    } catch (error) {
        return errorResponse(res, 'Something Went Wrong', { error: error.message }, 500);
    }
};

const getCategory = async (req, res) => {
    try {
        let { page = 1, limit = 10, name, sort_by = 'created_at', order = 'desc' } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        const query = Category.query();

        // Filtering by name (if provided)
        if (name) {
            query.where('category_name', 'like', `%${name}%`);
        }

        // Sorting (default: descending order by created_at)
        query.orderBy(sort_by, order);

        // Pagination
        const categories = await query.page(page - 1, limit);

        return successResponse(res, 'Categories fetched successfully', categories, 200);
    } catch (error) {
        return errorResponse(res, 'Something went wrong', { error: error.message }, 500);
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params; // Get category ID from URL
        const updates = req.body;  // Get fields to update

        // Check if category exists
        const category = await Category.query().findById(id);
        if (!category) {
            return errorResponse(res, 'Category not found', {}, 404);
        }

        // Update the category with only provided fields
        const updatedCategory = await Category.query()
            .patchAndFetchById(id, updates);

        return successResponse(res, 'Category updated successfully', updatedCategory, 200);
    } catch (error) {
        return errorResponse(res, 'Something went wrong', { error: error.message }, 500);
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params; // Get category ID from URL

        // Check if category exists
        const category = await Category.query().findById(id);
        if (!category) {
            return errorResponse(res, 'Category not found', {}, 404);
        }

        // Delete the category
        await Category.query().deleteById(id);

        return successResponse(res, 'Category deleted successfully', {}, 200);
    } catch (error) {
        return errorResponse(res, 'Something went wrong', { error: error.message }, 500);
    }
};



module.exports = {addCategory,getCategory,updateCategory,deleteCategory};
