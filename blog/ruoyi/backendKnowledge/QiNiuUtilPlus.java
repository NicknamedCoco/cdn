package com.ruoyi.file.utils;

import com.alibaba.nacos.shaded.com.google.gson.Gson;
import com.qiniu.common.QiniuException;
import com.qiniu.http.Response;
import com.qiniu.storage.BucketManager;
import com.qiniu.storage.Configuration;
import com.qiniu.storage.Region;
import com.qiniu.storage.UploadManager;
import com.qiniu.storage.model.BatchStatus;
import com.qiniu.storage.model.DefaultPutRet;
import com.qiniu.storage.model.FileInfo;
import com.qiniu.util.Auth;
import com.ruoyi.common.core.utils.IdUtils;
import com.ruoyi.file.config.QiniuProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

@Component
public class QiNiuUtilPlus {

    @Autowired
    private static QiniuProperties properties;

    //构造一个带指定Region对象的配置类
    private static final Configuration cfg = new Configuration(Region.region2());

    //提供有参构造函数，才能让properties有数据
    public QiNiuUtilPlus(QiniuProperties properties) {
        QiNiuUtilPlus.properties = properties;
    }

    //上传文件
    public static String uploadFile(MultipartFile file)  {
        UploadManager uploadManager= new UploadManager(cfg);
        //上传凭证
        String token = Auth.create(properties.getAccessKey(), properties.getSecretKey()).uploadToken(properties.getBucket());

        //获取文件名后缀
        String fileExt = FileUploadUtils.getExtension(file);
        //设置新的文件名
        String filename = IdUtils.fastUUID()+ "." + fileExt;

        //上传
        try {
            Response res = uploadManager.put(file.getBytes(), filename, token);
            if (res.isOK() && res.isJson()) {
                //解析上传成功的结果
                DefaultPutRet putRet = new Gson().fromJson(res.bodyString(), DefaultPutRet.class);
                return "http://"+properties.getDomain()+"/"+ putRet.key;
            } else {
                throw new QiniuException(res);
            }
        }catch(QiniuException ex){
            Response r = ex.response;
            System.err.println(r.toString());
            //参数可以配置成枚举类
            throw new RuntimeException("文件上传失败");
        }catch (IOException ex) {
            System.err.println(ex.toString());
            throw new RuntimeException("文件上传失败");
        }
    }

    /*
    * 下载私有空间文件
    *     如果是下载公开空间中的文件，直接domain+文件名即可，例如：puduhealth-image.keyi.world+keshi/keshi-1.png
    *     如果是下载私有空间中的文件，需要对拼接好的url进行授权
    * */
    public String downloadFile(String filename){
        try {
            //拼接好完整的url
            String encodedFileName = URLEncoder.encode(filename, "utf-8").replace("+", "%20");
            String publicUrl = String.format("%s/%s", properties.getDomain(), encodedFileName);

            //进行授权并设置好有效期，最后生成最终url返回
            return Auth.create(properties.getAccessKey(),properties.getSecretKey())
                    .privateDownloadUrl(publicUrl,properties.getExpireInSeconds());
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            return null;
        }
    }


    /*
    *   列举指定目录下的所有文件
    *       prefix为文件名前缀，开发中把"公司/存储/qiniu.jpg"整个叫文件名，prefix自然就是文件名前缀，
    *           我们也可以认为prefix是bucket下的目录名：例如：keshi/
    *       filter为是否需要prefix目录的子目录中的文件，
    *           true表示列举prefix的子目录中文件，false表示只需要prefix目录下文件，不包含子目录中文件
    * */
    public static ArrayList<String> getList(String prefix,Boolean filter) {
        Auth auth = Auth.create(properties.getAccessKey(), properties.getSecretKey());
        BucketManager bucketManager = new BucketManager(auth, cfg);

        //每次迭代的长度限制，最大1000，推荐值 1000
        int limit = 1000;
        //指定目录分隔符，列出所有公共前缀(模拟列出目录效果)。缺省值为空字符串
        String delimiter = "";

        //文件集合
        ArrayList<String> list = new ArrayList<>();

        //列举空间文件列表
        BucketManager.FileListIterator fileListIterator = bucketManager.createFileListIterator(properties.getBucket(), prefix, limit, delimiter);
        while (fileListIterator.hasNext()) {
            //处理获取的file list结果
            FileInfo[] items = fileListIterator.next();
            for (FileInfo item : items) {
                if (item.fsize!=0){
                    if (filter){
                        list.add(item.key);
                    }else {
                        if (item.key.indexOf("/") == item.key.lastIndexOf("/")) {
                            list.add(item.key);
                        }
                    }
                }
            }
        }
        return list;
    }


    //批量移除文件
    public static List<String> removeFiles(String... filenames) {
        Auth auth = Auth.create(properties.getAccessKey(), properties.getSecretKey());
        BucketManager bucketManager = new BucketManager(auth, cfg);

        // 删除成功的文件名列表
        List<String> removeSuccessList = new ArrayList<>();
        if (filenames.length > 0) {
            // 创建仓库管理器
            // 创建批处理器
            BucketManager.BatchOperations batch = new BucketManager.BatchOperations();
            // 批量删除多个文件
            batch.addDeleteOp(properties.getBucket(), filenames);
            try {
                // 获取服务器的响应
                Response res = bucketManager.batch(batch);
                // 获得批处理的状态
                BatchStatus[] batchStatuses = res.jsonToObject(BatchStatus[].class);
                for (int i = 0; i < filenames.length; i++) {
                    BatchStatus status = batchStatuses[i];
                    String key = filenames[i];
                    System.out.print(key + "\t");
                    if (status.code == 200) {
                        removeSuccessList.add(key);
                        System.out.println("delete success");
                    } else {
                        System.out.println("delete failure");
                    }
                }
            } catch (QiniuException e) {
                e.printStackTrace();
                throw new RuntimeException("批量删除异常");
            }
        }
        return removeSuccessList;
    }

}
