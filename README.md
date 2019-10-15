# Kafka Owl

![License](https://img.shields.io/github/license/cloudworkz/kafka-minion.svg?color=blue)
[![Go Report Card](https://goreportcard.com/badge/github.com/kafka-owl/kafka-owl)](https://goreportcard.com/report/github.com/kafka-owl/kafka-owl)
![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/kafka-owl/kafka-owl?sort=semver)
[![Docker image](https://img.shields.io/badge/docker%20image-ready-green)](https://github.com/kafka-owl/kafka-owl/packages/32621/versions)

Kafka Owl is a Web UI which helps you to explore messages in your cluster's topics in the most comfortable way.

![preview](docs/assets/preview.gif)

## Features

- [x] Supports Kafka 0.11.0.2 - 2.3.x (last updated 15th Oct 2019)
- [x] Fetch messages from Kafka Topics so that they can be comfortably previewed (JSON only for now, further formats coming soon)
- [x] Show Topic configuration with highlighted rows which have been modified
- [x] List all Topics' Low & High Watermarks
- [x] Performant & lightweight (e. g. fetching messages from one or across multiple partitions takes a few milliseconds)
- [x] Consumer group overview along with their members, member state & partition assignments

## Roadmap

- [ ] Add support for more message formats (key+value). Planned: XML, Avro, ...
- [ ] Authentication layer with SSO support
- [ ] Editing features such as editing consumer group offsets
- [ ] ACL support for listing/editing/creating/deleting topics, consumer groups, ...

## Install

### Arguments

| Argument | Description | Default |
| --- | --- | --- |
| --server.graceful-shutdown-timeout | Timeout for graceful shutdowns | 30s |
| --server.http.listen-port | HTTP server listen port | 80 |
| --server.http.read-timeout | Read timeout for HTTP server | 30s |
| --server.http.write-timeout | Write timeout for HTTP server | 30s |
| --server.http.idle-timeout | Idle timeout for HTTP server | 120s |
| --logging.level | Log granularity (debug, info, warn, error, fatal, panic) | info |
| --kafka.brokers | Array of broker addresses, delimited by comma (e. g. "kafka-1:9092, kafka-2:9092") | (No default) |
| --kafka.version | The kafka cluster's version (e. g. \"2.3.0\") | "0.11.0.2" |
| --kafka.client-id | ClientID to identify the consumer | "kafka-owl" |
| --kafka.sasl.enabled | Bool to enable/disable SASL authentication (only SASL_PLAINTEXT is supported) | false |
| --kafka.sasl.use-handshake | Whether or not to send the Kafka SASL handshake first | true |
| --kafka.sasl.username | SASL Username | (No default) |
| --kafka.sasl.password | SASL Password | (No default) |
| --kafka.tls.enabled | Whether or not to use TLS when connecting to the broker | false |
| --kafka.tls.ca-file-path | Path to the TLS CA file | (No default) |
| --kafka.tls.key-file-path | Path to the TLS key file | (No default) |
| --kafka.tls.cert-file-path | Path to the TLS cert file | (No default) |
| --kafka.tls.insecure-skip-verify | If true, TLS accepts any certificate presented by the server and any host name in that certificate. | false |
| --kafka.tls.passphrase | Passphrase to decrypt the TLS key (leave empty for unencrypted key files) | (No default) |
