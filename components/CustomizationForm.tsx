"use client";

import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import Image from "next/image";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useRef, useState, useTransition } from "react";
import { ImageIcon, Palette, Upload, X } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

const CustomizationForm: React.FC = () => {
  const { user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateCustomizations = useMutation(
    api.lib.customizations.updateCustomizations,
  );

  const generateUploadUrl = useMutation(
    api.lib.customizations.generateUploadUrl,
  );

  const removeProfilePicture = useMutation(
    api.lib.customizations.removeProfilePicture,
  );

  const existingCustomizations = useQuery(
    api.lib.customizations.getUserCustomizations,
    user ? { userId: user.id } : "skip",
  );

  const [formData, setFormData] = useState({
    description: "",
    accentColor: "#6366f1",
  });

  const [isLoading, startTransition] = useTransition();
  const [isUploading, startUploading] = useTransition();

  const handledSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    startTransition(async () => {
      try {
        await updateCustomizations({
          description: formData.description || undefined,
          accentColor: formData.accentColor || undefined,
        });

        toast.success("Lưu tùy chỉnh thành công!");
      } catch (error) {
        console.error("Không thể lưu tùy chỉnh:", error);
        toast.error("Không thể lưu tùy chỉnh");
      }
    });
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn một tệp hình ảnh");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước tệp phải nhỏ hơn 5MB");
      return;
    }

    startUploading(async () => {
      try {
        //get upload URL
        const uploadUrl = await generateUploadUrl();
        //upload file
        const uploadResult = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!uploadResult.ok) {
          throw new Error("Tải lên không thành công");
        }

        const { storageId } = await uploadResult.json();
        //update customizations with new storage ID
        await updateCustomizations({
          profilePictureStorageId: storageId,
          description: formData.description || undefined,
          accentColor: formData.accentColor || undefined,
        });
        toast.success("Hình ảnh hồ sơ được tải lên thành công!");
      } catch (error) {
        console.error("Không tải lên hình ảnh:", error);
        toast.error("Không thể tải lên hình ảnh");
      } finally {
        //reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    });
  };

  const handleRemoveImage = async () => {
    startTransition(async () => {
      try {
        await removeProfilePicture();
        toast.success("Hình ảnh hồ sơ đã xóa thành công!");
      } catch (error) {
        console.error("Không thể xóa hình ảnh:", error);
        toast.error("Không thể xóa hình ảnh");
      }
    });
  };

  useEffect(() => {
    if (existingCustomizations) {
      setFormData({
        description: existingCustomizations.description || "",
        accentColor: existingCustomizations.accentColor || "#6366f1",
      });
    }
  }, [existingCustomizations]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="w-full bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl shadow-gray-200/50">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Tùy chỉnh trang của bạn
            </h2>
            <p className="text-gray-600 text-sm">
              Cá nhân hóa trang liên kết công khai của bạn với hình ảnh hồ sơ
              tùy chỉnh, mô tả và màu sắc chủ đề.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handledSubmit} className="space-y-6">
        {/* profile picture upload */}
        <div className="space-y-4">
          <Label className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Hình ảnh hồ sơ
          </Label>
          {/* current image display */}
          {existingCustomizations?.profilePictureUrl && (
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 rounded-lg overflow-hidden">
                <Image
                  src={existingCustomizations.profilePictureUrl}
                  alt="current profile picture"
                  width={64}
                  height={64}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 font-medium">
                  Hình ảnh hồ sơ hiện tại
                </p>
                <p className="text-xs text-gray-500">
                  Click &ldquo;Remove&rdquo; dể xóa hình ảnh này
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemoveImage}
                disabled={isLoading}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="w-4 h-4 mr-1" />
                Xóa bỏ
              </Button>
            </div>
          )}

          {/* file upload */}
          <div className="flex items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              {isUploading ? "Tải lên..." : "Tải lên hình ảnh"}
            </Button>
            <p className="text-sm text-gray-500">
              Tối đa 5MB, Hỗ trợ JPG, PNG, GIF, WebP
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Sự miêu tả</Label>
          <textarea
            id="description"
            placeholder="Hãy cho người dùng truy cập biết về bạn..."
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-vertical"
            maxLength={200}
          />
          <p className="text-sm text-gray-500">
            {formData.description.length}/200 ký tự
          </p>
        </div>

        {/* accent color picker */}
        <div className="space-y-3">
          <Label htmlFor="accentColor">Chọn màu sắc</Label>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <input
                id="accentColor"
                type="color"
                value={formData.accentColor}
                onChange={(e) =>
                  handleInputChange("accentColor", e.target.value)
                }
                className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
              />
              <div>
                <p className="text-sm font-medium text-gray-700">Màu sắc</p>
                <p className="text-xs text-gray-500">{formData.accentColor}</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Màu sắc được sử dụng trong tiêu đề trang của bạn
          </p>
        </div>

        {/* Save Button */}
        <div className="pt-4">
          <Button
            type="submit"
            disabled={isLoading || isUploading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {isLoading ? "Lưu..." : "Lưu tùy chỉnh"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CustomizationForm;
