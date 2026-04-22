package lets_play.lets_play.service;

import java.io.IOException;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import lets_play.lets_play.exception.AppException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public String uploadImage(MultipartFile file) {
        if (file == null || file.isEmpty())
            return null;

        try {
            Map result = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap("folder", "letsplay/products")
            );
            return result.get("secure_url").toString();
        } catch (IOException e) {
            throw new AppException("Failed to upload image", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public void deleteImage(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) return;
        try {
            String publicId = extractPublicId(imageUrl);
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException ignored) {}
    }

    private String extractPublicId(String url) {
        String[] parts = url.split("/");
        String file = parts[parts.length - 1];
        return "letsplay/products/" + file.split("\\.")[0];
    }
}