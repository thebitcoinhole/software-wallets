# The Bitcoin Hole - Software Wallets

## Introduction

Software wallets, also known as hot wallets, are applications that enable users to store, manage, and transact with Bitcoin. Unlike hardware wallets, which are physical devices, software wallets are digital and run on various platforms, including desktop, mobile, and web.

This project goal is to have the more complete database of Bitcoin Software Wallets features, so they can be compared, helping users to choose wisely. The database is open-source, meaning anyone can collaborate to improve and correct any wrong data or add new wallets.

## Collaboration

Inside the `items` directory, there is a JSON file for each wallet, with all the data about it. To collaborate (adding missing data, fixing wrong data or adding a new wallet), just fork the repository and send a pull request with the changes.

## JSON format

The following is a sample of the JSON format:

```json
{
    "id": "wallet-id",
    "name": "Wallet Name",
    "category-name": {
      "feature-name-1": {
        "value": "YES", 
        "flag": "positive",
        "supported": true,
        "texts": [
          "Optional contextual text describing the feature"
        ],
        "links": [
          {
            "title": "Optional contextual link referencing official documentation",
            "url": "url"
          }
        ]
      },
      "feature-name-2": {
        "value": "Experimental",
        "flag": "neutral",
        "supported": true
      },
      "feature-name-3": {
        "value": "NO",
        "flag": "negative",
        "supported": false
      }
    }
}
```

JSON fields:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| id | string | true | The wallet id. It matches with the JSON file name. |
| name | string | true | The wallet name. |
| category-name.feature-name-1.value | string | yes | The visible feature value. For example: `"YES"`, `"NO"`, `"Experimental"`, etc |
| category-name.feature-name-1.flag | string | no | The flag of the wallet feature. Possible values: `"positive"`, `"neutral"` or `"negative"` |
| category-name.feature-name-1.supported | boolean | no | If the feature is supported by the wallet. This is used to filter by this feature |
| category-name.feature-name-1.texts | array of strings | no | Official Texts with info about the feature |
| category-name.feature-name-1.links | array of objects | no | Official links with info about the feature |
| category-name.feature-name-1.links.title | string | yes | The title of the link |
| category-name.feature-name-1.links.url | string | yes | The url of the link |

On each pull request, the JSON files are verified to be sure they are valid and well-formatted. You can run the following command inside the `scripts` directory to format the JSON before sending a pull request:

```
node json-format.js
```

All the features supported:

| Category | Category Id | Feature | Feature Id |
| --- | --- | --- | --- |
| Basic Information | basic-information | Launch Year | year |
| Company | company | Brand | brand |
| Company | company | Headquarters | headquarters |
| Company | company | Website | website |
| Company | company | Blog | blog |
| Company | company | X (Twitter) | twitter |
| Company | company | Nostr | nostr |
| Company | company | YouTube | youtube |
| Company | company | GitHub / GitLab | github |
| Company | company | Slack | slack |
| Company | company | Discord | discord |
| Communities | communities | Telegram | telegram |
| Communities | communities | Reddit | reddit |
| Networks | networks | Bitcoin Mainnet | btc-mainnet |
| Networks | networks | Bitcoin Testnet | btc-testnet |
| Networks | networks | Bitcoin Regtest | btc-regtest |
| Networks | networks | Bitcoin signet | btc-signet |
| Networks | networks | Lightning Network | lightning-network |
| Networks | networks | Liquid | liquid |
| Currency | currency | Fiat Denominations | fiat |
| Currency | currency | Bitcoin Unit (BTC) | btc |
| Currency | currency | Bitcoin Unit (SAT) | sats |
| Currency | currency | Exchange Rate Provider | exchange-rate-provider |
| Source Code | source-code | Lastest Version | latest-version |
| Source Code | source-code | Lastest Release Date | latest-release-date |
| Source Code | source-code | Release Notes | release-notes |
| Source Code | source-code | Source-available | source-available |
| Source Code | source-code | Open Source | open-source |
| Source Code | source-code | License | license |
| Source Code | source-code | Reproducible Builds | reproducible-builds |
| Platforms | platforms | Web | web |
| Platforms | platforms | Windows | windows |
| Platforms | platforms | MacOS | macos |
| Platforms | platforms | Linux | linux |
| Platforms | platforms | Android | android |
| Platforms | platforms | iOS | ios |
| Platforms | platforms | UmbrelOS | umbrel-os |
| Platforms | platforms | StartOs | start-os |
| Connectivity | connectivity | USB Data | usb-data |
| Connectivity | connectivity | NFC | nfc |
| Connectivity | connectivity | QR scanner | qr-scanner |
| App Lock | app-lock | PIN Lock | pin-lock |
| App Lock | app-lock | Duress PIN | duress-pin |
| App Lock | app-lock | Dynamic Keypad | dynamic-keypad |
| App Lock | app-lock | Countdown to Reset PIN | countdown-reset-pin |
| App Lock | app-lock | Alphanumeric PIN | alphanumeric-pin |
| App Lock | app-lock | Pattern Lock | pattern-lock |
| App Lock | app-lock | Fingerprint Lock | fingerprint-lock |
| Private Keys | private-keys | Hot Keys Support | hot-keys |
| Private Keys | private-keys | Mulitple Wallets at the same time | multiple-wallets |
| Private Keys | private-keys | User Added Entropy | user-added-entropy |
| Private Keys | private-keys | Passphrases support | passphrase-support |
| Private Keys | private-keys | Master Key Fingerprint | master-key-fingerprint |
| Private Keys | private-keys | Backup / recovery with BIP39 seed phrase | backup-recovery-seedphrase |
| Private Keys | private-keys | 12 Words BIP39 Seed Creation | create-12-words |
| Private Keys | private-keys | 24 Words BIP39 Seed Creation | create-24-words |
| Private Keys | private-keys | 12 Words BIP39 Seed Import | import-12-words |
| Private Keys | private-keys | 24 Words BIP39 Seed Import | import-24-words |
| Private Keys | private-keys | SeedQR | seed-qr |
| Fees | fees | Fee Control | fee-control |
| Fees | fees | Replace-by-fee (RBF) | replace-by-fee |
| Fees | fees | Child-pays-for-parent (CPFP) | child-pays-for-parent |
| Privacy | privacy | Coin Control | coin-control |
| Privacy | privacy | Custom Node | custom-node |
| Privacy | privacy | Tor | tor |
| Privacy | privacy | Coinjoin | coinjoin |
| Privacy | privacy | Hide Sensitive Data | hide-sensitive-data |
| Privacy | privacy | Stealth Mode | stealth-mode |
| Privacy | privacy | Built-in secure communication | built-in-secure-communication |
| Other Features | other-features | Multi-sig (PSBTs) | multi-sig |
| Other Features | other-features | Transaction Labeling | transaction-labeling |
| Other Features | other-features | Batch Transactions | batch-transactions |
| Other Features | other-features | Miniscript | miniscript |
| Other Features | other-features | Taproot | taproot |
| Other Features | other-features | Timelocks | timelocks |
| Other Features | other-features | Encrypted Storage | encrypted-storage |
| Other Features | other-features | Dark Mode | dark-mode |
| Hardware Wallets Support | hardware-wallets-support | Jade | jade |
| Hardware Wallets Support | hardware-wallets-support | Colcard MK4 | coldcard-mk4 |
| Hardware Wallets Support | hardware-wallets-support | BitBox02 | bitbox02-btconly |
| Hardware Wallets Support | hardware-wallets-support | Keystone 3 Pro | keystone-3-pro |
| Hardware Wallets Support | hardware-wallets-support | Passport Batch 2 | passport-batch-2 |
| Hardware Wallets Support | hardware-wallets-support | Trezor Model One | trezor-model-one |
| Hardware Wallets Support | hardware-wallets-support | Trezor Model T | trezor-model-t |
| Hardware Wallets Support | hardware-wallets-support | Ledger Nano S Plus | ledger-nano-s-plus |
| Hardware Wallets Support | hardware-wallets-support | Ledger Nano X | ledger-nano-x |
| Hardware Wallets Support | hardware-wallets-support | SeedSigner | seedsigner |
| Hardware Wallets Support | hardware-wallets-support | Specter DIY | specter-diy |
| Hardware Wallets Support | hardware-wallets-support | Tapsigner | tapsigner |
| Paid Services | paid-services | Assisted Self-custody | assisted-self-custody |
| Paid Services | paid-services | Inheritance Planning | inheritance-planning |

## Website

The [thebitcoinhole.com](https://thebitcoinhole.com/) website offers a Software Wallet Comparison using this database. This website is the most comprehensive resource for comparing the features of top software wallets. It provides an in-depth analysis of each wallet’s security features, privacy, usability, compatibility, and more.

## Sponsor this project
Sponsor this project to help us get the funding we need to continue working on it.

* [Donate with Bitcoin Lightning](https://getalby.com/p/thebitcoinhole) ⚡️ [thebitcoinhole@getalby.com](https://getalby.com/p/thebitcoinhole)
* [Donate with PayPal or a credit card using Ko-fi](https://ko-fi.com/thebitcoinhole)
* [Donate on Patreon](https://www.patreon.com/TheBitcoinHole)

## Follow us
* [Twitter](http://twitter.com/thebitcoinhole)
* [Nostr](https://snort.social/p/npub1mtd7s63xd85ykv09p7y8wvg754jpsfpplxknh5xr0pu938zf86fqygqxas)
* [Medium](https://blog.thebitcoinhole.com/)
* [GitHub](https://github.com/thebitcoinhole)
