// Cloudinaryの設定情報
export const CLOUD_NAME = 'dt6czo3qw';
export const UPLOAD_PRESET = 'profilephoto';

export const photoupload = async (file: File) => {
  // フォームデータを作成し、ファイルとプリセットを追加
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      },
    );

    const data = await response.json();
    return {
      url: data.secure_url,
      publicId: data.public_id,
    };
  } catch (error) {
    console.error('アップロード中にエラーが発生しました:', error);
    throw error;
  }
};
