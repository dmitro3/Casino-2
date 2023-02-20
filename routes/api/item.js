const express = require('express');
const router = express.Router();

// router.post(
//   "/item",
//   async (req, res) => {
//     try {
//       const item = req.body;
//       const result = itemSchema.validate(item);
//       if (result.error) {
//         console.log(result.error);
//         res.status(400).end();
//         return;
//       }
//       insertItem(item)
//         .then(() => {
//           res.status(200).end();
//         })
//       } catch (err) {
//         console.log(err);
//         res.status(500).end();
//       }
// });


// router.get("/items", (req, res) => {
//   getItems(req)
//     .then((items) => {
//       items = items.map((item) => ({
//         id: item._id,
//         name: item.name,
//         quantity: item.quantity,
//       }));
//       res.json(items);
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).end();
//     });
// });

// router.put("/item/:id/quantity/:quantity", (req, res) => {
//   const { id, quantity } = req.params;
//   updateQuantity(id, parseInt(quantity))
//     .then(() => {
//       res.status(200).end();
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).end();
//     });
// });

module.exports = router;