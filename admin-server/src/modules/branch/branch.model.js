const mongoose = require('mongoose');

const BranchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

/**
 * Methods
 */
BranchSchema.method({
  /** Transform into JSON */
  transform(fields) {
    const transformed = {};
    const _fields = fields && fields.length ? fields : ['id', 'name'];
    _fields.forEach(field => {
      transformed[field] = this[field];
    });
    return transformed;
  },
});

BranchSchema.statics = {
  /** Get branch */
  async get(query) {
    try {
      if (query._id && !mongoose.Types.ObjectId.isValid(query._id)) {
        return undefined;
      }
      return await this.findOne(query);
    } catch (err) {
      throw err;
    }
  },
  /** Get list branches */
  list() {
    return this.find({}).exec();
  },
};

module.exports = mongoose.model('Branch', BranchSchema);
