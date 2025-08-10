const Contact = require("../Model/Contact")

exports.contactUsController = async (req, res) => {
  try {
    const { fullName, email, mobile, message } = req.body;

    if (!fullName || !email || !mobile || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Save contact request to DB
    await Contact.create({ fullName, email, mobile, message });

    return res.status(201).json({ message: "Contact form submitted successfully" });
  } catch (error) {
    console.error("❌ Error in contactUsController:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
