export interface PublishResult {
  platform: string;
  success: boolean;
  postId?: string;
  error?: string;
}

export async function publishToFacebook(
  content: string,
  pageId: string,
  accessToken: string,
  imageUrl?: string,
): Promise<PublishResult> {
  try {
    const params = new URLSearchParams({ message: content, access_token: accessToken });
    if (imageUrl) params.append("link", imageUrl);
    const res = await fetch(`https://graph.facebook.com/v19.0/${pageId}/feed`, {
      method: "POST",
      body: params,
    });
    const data = await res.json() as { id?: string; error?: { message: string } };
    if (!res.ok || data.error) {
      return { platform: "facebook", success: false, error: data.error?.message || "發佈失敗" };
    }
    return { platform: "facebook", success: true, postId: data.id };
  } catch (err) {
    return { platform: "facebook", success: false, error: String(err) };
  }
}

export async function publishToInstagram(
  content: string,
  igUserId: string,
  accessToken: string,
  imageUrl?: string,
): Promise<PublishResult> {
  if (!imageUrl) {
    return { platform: "instagram", success: false, error: "Instagram 必須附上圖片網址" };
  }
  try {
    const containerRes = await fetch(`https://graph.facebook.com/v19.0/${igUserId}/media`, {
      method: "POST",
      body: new URLSearchParams({
        caption: content,
        image_url: imageUrl,
        media_type: "IMAGE",
        access_token: accessToken,
      }),
    });
    const containerData = await containerRes.json() as { id?: string; error?: { message: string } };
    if (!containerRes.ok || containerData.error) {
      return { platform: "instagram", success: false, error: containerData.error?.message || "建立媒體容器失敗" };
    }
    const publishRes = await fetch(`https://graph.facebook.com/v19.0/${igUserId}/media_publish`, {
      method: "POST",
      body: new URLSearchParams({ creation_id: containerData.id!, access_token: accessToken }),
    });
    const publishData = await publishRes.json() as { id?: string; error?: { message: string } };
    if (!publishRes.ok || publishData.error) {
      return { platform: "instagram", success: false, error: publishData.error?.message || "發佈失敗" };
    }
    return { platform: "instagram", success: true, postId: publishData.id };
  } catch (err) {
    return { platform: "instagram", success: false, error: String(err) };
  }
}

export async function publishToThreads(
  content: string,
  userId: string,
  accessToken: string,
  imageUrl?: string,
): Promise<PublishResult> {
  try {
    const containerParams: Record<string, string> = {
      text: content,
      media_type: imageUrl ? "IMAGE" : "TEXT",
      access_token: accessToken,
    };
    if (imageUrl) containerParams.image_url = imageUrl;
    const containerRes = await fetch(`https://graph.threads.net/v1.0/${userId}/threads`, {
      method: "POST",
      body: new URLSearchParams(containerParams),
    });
    const containerData = await containerRes.json() as { id?: string; error?: { message: string } };
    if (!containerRes.ok || containerData.error) {
      return { platform: "threads", success: false, error: containerData.error?.message || "建立 Threads 容器失敗" };
    }
    const publishRes = await fetch(`https://graph.threads.net/v1.0/${userId}/threads_publish`, {
      method: "POST",
      body: new URLSearchParams({ creation_id: containerData.id!, access_token: accessToken }),
    });
    const publishData = await publishRes.json() as { id?: string; error?: { message: string } };
    if (!publishRes.ok || publishData.error) {
      return { platform: "threads", success: false, error: publishData.error?.message || "Threads 發佈失敗" };
    }
    return { platform: "threads", success: true, postId: publishData.id };
  } catch (err) {
    return { platform: "threads", success: false, error: String(err) };
  }
}
