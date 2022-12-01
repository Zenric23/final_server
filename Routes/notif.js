const router = require("express").Router();
const Notification = require("../Model/Notification");
const { getTotalDocuments } = require("../util/getTotalDocuments");
const { verifyTokenAndAdmin } = require("./verifyToken");


router.get("/", async (req, res) => {
  const page = req.query.p || 0;
  let notifPerPage = 10;
  let reviews
  let totalNotifs

  try {
      
      if (req.query.latest) {
        notifPerPage = 5

      reviews = await Notification
        .find()
        .skip(notifPerPage * page)
        .limit(notifPerPage)
        .sort({ createdAt: -1 });

      totalNotifs = await getTotalDocuments(
        Notification,
        page,
        notifPerPage,
        { createdAt: -1 },
        null
      );

      const totalUnread = await Notification.find({ isRead: false }).count();

      res.status(200).json({ reviews, totalUnread, totalNotifs });
      return

    }

    const sort = req.query.sort

    if(sort === 'read') {
      reviews = await Notification.find({isRead: true})
      .skip(notifPerPage * page)
      .limit(notifPerPage)
      .sort({ createdAt: -1 });

      totalNotifs = await getTotalDocuments(
        Notification,
        page,
        notifPerPage,
        { createdAt: -1 },
        { isRead: true }
      );

    } else if (sort === 'unread') {
      reviews = await Notification.find({isRead: false})
      .skip(notifPerPage * page)
      .limit(notifPerPage)
      .sort({ createdAt: -1 });

      totalNotifs = await getTotalDocuments(
        Notification,
        page,
        notifPerPage,
        { createdAt: -1 },
        { isRead: false }
      );

    } else {
      reviews = await Notification.find()
      .skip(notifPerPage * page)
      .limit(notifPerPage)
      .sort({ createdAt: -1 });

      totalNotifs = await getTotalDocuments(
        Notification,
        page,
        notifPerPage,
        { createdAt: -1 },
        null
      );
    }

    const totalUnread = await Notification.find({ isRead: false }).count();

    res.status(200).json({ reviews, totalUnread, totalNotifs });

  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});


router.put("/:id", async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json("one notifications updated!");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.put("/", async (req, res) => {
  try {
    await Notification.updateMany(
      { isRead: false },
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json("notifications updated!");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
