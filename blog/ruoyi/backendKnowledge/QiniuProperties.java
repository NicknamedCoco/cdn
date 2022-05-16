package com.ruoyi.file.config;

import com.qiniu.common.Zone;
import com.qiniu.storage.Region;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * @author 万一
 * @date 2021年07月09日20:45
 */
@Component
@ConfigurationProperties(prefix = "oss.qiniu")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class QiniuProperties {
    private String accessKey;
    private String secretKey;
    private String bucket;
    private String domain;
    private Long expireInSeconds;
}
