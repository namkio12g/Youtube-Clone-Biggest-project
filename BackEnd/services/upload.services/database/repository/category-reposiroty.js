const mongoose = require("mongoose")
const categoryModel = require('../models/category.model.js');
class categoryRepository {
    async createCategory(title, description) {
        try {
            const newCategory=await new categoryModel({
                title:title,
                description:description
            })
            const result =await newCategory.save()
            return result;
        } catch (error) {
            throw error;
        }
   

    }

    //update

    async updateCategory(id,title,description,status){
        try {
            const category=await categoryModel.findByIdAndUpdate(id,{
                title:title,
                description:description,
                status:status
            })
            return category;
        } catch (error) {
            throw error
        }

    }
    //delete
    async deleteCategory(id) {
        try {
            const category = await categoryModel.findByIdAndUpdate(id, {
                delete:true
            })
            return category;
        } catch (error) {
            throw error
        }

    }
     //find one category by id
     async findOneCategoryId(id) {
         try {
             const category = await categoryModel.findById(id)
             return category;
         } catch (error) {
             throw error;
         }

     }
     //find categories

     async findCategories(status,title){
        try {
            const find={}
            if(status!=""){
                find.status=status
            }
            if(title!=""){
                find.title={$regex:title,$option:"i"}
            }
            const categories = await categoryModel.find(find)
            return categories;
        } catch (error) {
            throw error;
        }
     }
}   
module.exports=categoryRepository;