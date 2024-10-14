interface InputProps {
  label: string;
  name: string;
  setPhoto: (photo: any) => void;
}

const compressBase64Image = (base64: any, maxSizeInBytes: number, maxWidth: number, maxHeight: number, quality: number = 0.7) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64;

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Resize the image if it exceeds the maximum dimensions
      if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
      }
      if (height > maxHeight) {
        width *= maxHeight / height;
        height = maxHeight;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);

      let compressedBase64 = canvas.toDataURL('image/jpeg', quality);

      // If the compressed image is still too large, reduce quality further
      while (compressedBase64.length > maxSizeInBytes && quality > 0.1) {
        quality -= 0.1;
        compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      }

      resolve(compressedBase64);
    };

    img.onerror = (error) => {
      reject(error);
    };
  });
}

const ProfilePictureInput: React.FC<InputProps> = ({ label, name, setPhoto }) => {
  const convertToBase64 = (e: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = async () => {
      const optimizedPhoto = await compressBase64Image(reader.result, 200000, 800, 600);
      setPhoto(optimizedPhoto);
    }
    reader.onerror = (error) => {
      console.error('Error: ', error);
    }
  }

  return (
    <div>
      <div className='flex flex-col gap-2'>
      <label htmlFor={name} className='text-white'>{label}</label>
      <input 
        type="file" 
        accept="photo/*" 
        onChange={convertToBase64} 
        id={name}
        name={name}
        className="bg-neutral-800 p-3 text-neutral-200 rounded-md" 
      />
    </div>
    </div>
  );
};

export default ProfilePictureInput;
