
const mongoose = require('mongoose');
const moment = require('moment')

const ObjectId = mongoose.Types.ObjectId

const filterData = (data) => {
    const fData = {}
    if (!data.filters) {
        data.filters = {}
    }
    const { filters } = data
    Object.keys(filters).forEach((key) => {
        if (filters[key].type === 'in' || filters[key].type === 'nin' || filters[key].type === 'eq' || filters[key].type === 'ne' || filters[key].type === 'lt' || filters[key].type === 'lte' || filters[key].type === 'gt' || filters[key].type === 'gte') {
            if (filters[key].value) {
                fData[filters[key].field] = { ['$' + filters[key].type]: filters[key].value }
            }
        }

        if (filters[key].type === 'like') {
            if (filters[key].value) {
                fData[filters[key].field] = { $regex: '.*' + filters[key].value + '.*', $options: "i" }
            }
        }

    })
    return fData
}

exports.filterData = filterData

const sortData = (data) => {
    let sortBy = ''
    if (data.sort) {
        sortBy = data.sort.split(',').join(' ');
    } else {
        sortBy = '-createdAt';
    }

    return sortBy;
}

exports.sortData = sortData

const limitData = (data) => {
    let fields = ''
    if (data.fields) {
        fields = data.fields.split(',').join(' ');
    } else {
        fields = '-__v';
    }

    return fields;
}

exports.limitData = limitData

const paginateData = (data) => {
    const page = data.page * 1 || 1;
    const limit = data.limit * 1 || 20;
    const skip = (page - 1) * limit;

    return { skip, limit };
}

exports.paginateData = paginateData

exports.processResults = async (req, model, populate, totalRecords = true) => {
    const result = {}
    let query;

    // Filter
    const fData = filterData(req.body)
    query = model.find(fData);

    // Selecting required fields
    const lData = limitData(req.body)
    query = query.select(lData);

    // Sort
    const sData = sortData(req.body)
    query = query.sort(sData);

    // Pagination
    const pData = paginateData(req.body)
    query = query.skip(pData.skip).limit(pData.limit);

    if (populate) {
        if (Array.isArray(populate)) {
            populate.forEach(p => {
                query = query.populate(p);
            })
        } else {
            query = query.populate(populate);
        }
    }

    // Executing query
    result.records = await query;

    if (totalRecords) {
        result.totalRecords = await model.countDocuments(fData)
        result.setDisp = `${pData.skip + 1}-${pData.skip + result.records.length}`
    }

    return result
};

exports.validateMongoId = (id) => {
    return ObjectId.isValid(id) && typeof id !== "number"
}

exports.arrayOfObjectsSort = (array, sortProperty, sort = "asc") => {
    function compare(a, b) {
        if (a[sortProperty] < b[sortProperty]) {
            return sort === "asc" ? -1 : 1;
        }
        if (a[sortProperty] > b[sortProperty]) {
            return sort === "asc" ? 1 : -1;
        }
        return 0;
    }

    return array.sort(compare)
}


exports.slugify = (string, options) => {
    let str = string ? string.toString() : ''
    if (!options) {
        str = str ? str.trim() : ''
        str = str ? str.toLowerCase() : ''
        str = str ? str.split(" ").join("_") : ''
    } else {
        if (options.trim === true) {
            str = str ? str.trim() : ''
        }
        if (options.lower === true) {
            str = str ? str.toLowerCase() : ''
        }
        if (options.upper === true) {
            str = str ? str.toUpperCase() : ''
        }
        if (options.replacement && replacement.trim()) {
            str = str ? str.split(" ").join(options.replacement) : ''
        }
    }

    return str
}

exports.getIstDateTime = (meridiem = false, format = "MM-DD-YYYY") => {
    if (meridiem) {
        return moment().utcOffset("+05:30").format(`${format} hh:mm:ss a`)
    } else {
        return moment().utcOffset("+05:30").format(`${format} HH:mm:ss`)
    }
}

exports.asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index += 1) {
        await callback(array[index], index, array)
    }
}