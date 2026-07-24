exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) return res.fail('请选择图片文件')
    // Cloudinary 返回的文件信息包含 secure_url
    const url = req.file.path // Cloudinary 存储返回的完整 URL
    const filename = req.file.filename
    res.success({ url, filename }, '上传成功')
  } catch (err) { next(err) }
}
