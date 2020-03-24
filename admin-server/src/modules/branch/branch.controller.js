const httpStatus = require('http-status');
const Branch = require('mongoose').model('Branch');

/**
 * GET /branches
 * Get list of branches
 */
exports.getBranches = async (req, res, next) => {
  try {
    const branches = await Branch.list();
    const transformedBranches = branches.map(branch => branch.transform());
    res.status(httpStatus.OK).json(transformedBranches);
  } catch (err) {
    return next(err);
  }
};

// exports.initBranches = async (req, res, next) => {
//   try {
//     const data = [
//       { name: 'Johor' },
//       { name: 'Kedah' },
//       { name: 'Kelantan' },
//       { name: 'Melaka' },
//       { name: 'Negeri Sembilan' },
//       { name: 'Pahang' },
//       { name: 'Perak' },
//       { name: 'Perlis' },
//       { name: 'Pulau Pinang' },
//       { name: 'Sabah' },
//       { name: 'Sarawak' },
//       { name: 'Selangor' },
//       { name: 'Terengganu' },
//       { name: 'Wilayah Persekutuan Labuan' },
//       { name: 'Wilayah Persekutuan Kuala Lumpur' },
//       { name: 'Wilayah Persekutuan Putrajaya' },
//     ];
//     await Promise.all(
//       data.map(item => {
//         const branch = new Branch({
//           name: item.name,
//         });
//         return branch.save();
//       }),
//     );
//     res.json('DONE');
//   } catch (err) {
//     return next(err);
//   }
// };
