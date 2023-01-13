module.exports = async (message,args) =>{
    const solanaWeb3 = require('@solana/web3.js');
    const { Connection, programs } = require('@metaplex/js');
    const axios = require('axios');
    const fetch = require("node-fetch");
    const fs = require('fs');
    PROJECT_ADDRESS = args[0];
    DISCORD_URL = args[1];
    
    if (!PROJECT_ADDRESS || !DISCORD_URL) {
        console.log("please set your environment variables!");
        return;
    }
    
    const projectPubKey = new solanaWeb3.PublicKey(PROJECT_ADDRESS);
    const url = solanaWeb3.clusterApiUrl('mainnet-beta');
    const solanaConnection = new solanaWeb3.Connection(url, 'confirmed');
    const metaplexConnection = new Connection('mainnet-beta');
    const { metadata: { Metadata } } = programs;
    const pollingInterval = 60000; // ms
    const marketplaceMap = {
        "MEisE1HzehtrDpAAT8PnLHjpSSkRYakotTuJRPjTpo8": "Magic Eden",
        "M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K": "Magic Eden V2",
        "HZaWndaNWHFDd9Dhk5pqUUtsmoBCqzb1MLu3NAh1VX6B": "Alpha Art",
        "617jbWo616ggkDxvW1Le8pV38XLbVSyWY8ae6QUmGBAU": "Solsea",
        "CJsLwbP1iu5DuUikHEJnLfANgKy6stB2uFgvBBHoyxwz": "Solanart",
        "A7p8451ktDCHq5yYaHczeLMYsjRsAkzc3hCXcSrwYHU7": "Digital Eyes",
        "AmK5g2XcyptVLCFESBCJqoSfwV3znGoVYQnqEnaAZKWn": "Exchange Art",
        };
    
    const runSalesBot = async () => {
        console.log("starting sales bot...");
    
        let signatures;
        let lastKnownSignature;
        const mostRecentSignature = await solanaConnection.getSignaturesForAddress(projectPubKey, { limit: 1 });
        const options = { until: mostRecentSignature[0].signature }
        while (true) {
            try {
                signatures = await solanaConnection.getSignaturesForAddress(projectPubKey, options);
                if (!signatures.length) {
                    console.log("polling...")
                    await timer(pollingInterval);
                    continue;
                }
            } catch (err) {
                console.log("error fetching signatures: ", err);
                continue;
            }
    
            for (let i = signatures.length - 1; i >= 0; i--) {
                try {
                    let { signature } = signatures[i];
                    const txn = await solanaConnection.getTransaction(signature);
                    if (txn.meta && txn.meta.err != null) { continue; }
    
                    const dateString = new Date(txn.blockTime * 1000).toLocaleString();
                    const price = Math.abs((txn.meta.preBalances[0] - txn.meta.postBalances[0])) / solanaWeb3.LAMPORTS_PER_SOL;
                    const accounts = txn.transaction.message.accountKeys;
                    for(let i = 1; i <= accounts.length; i++){
                        if(marketplaceMap[accounts[accounts.length - i].toString()]){
                            marketplaceAccount = accounts[accounts.length - i].toString();
                            continue;
                        }
                    }
    
                    if (marketplaceMap[marketplaceAccount]) {
                        const metadata = await getMetadata(txn.meta.postTokenBalances[0].mint);
                        if (!metadata) {
                            console.log("couldn't get metadata");
                            continue;
                        }
    
                        printSalesInfo(dateString, price, signature, metadata.name, marketplaceMap[marketplaceAccount], metadata.image);
                        await stats(metadata.collection.name,metadata.name, price, dateString, signature, metadata.image,marketplaceMap[marketplaceAccount],txn.meta.postTokenBalances[0].mint)
                    } else {
                        console.log("not a supported marketplace sale");
                    }
                } catch (err) {
                    console.log("error while going through signatures: ", err);
                    continue;
                }
            }
    
            lastKnownSignature = signatures[0].signature;
            if (lastKnownSignature) {
                options.until = lastKnownSignature;
            }
        }
    }
    runSalesBot();
    
    const printSalesInfo = (date, price, signature, title, marketplace, imageURL) => {
        console.log("-------------------------------------------")
        console.log(`Sale at ${date} ---> ${price} SOL`)
        console.log("Signature: ", signature)
        console.log("Name: ", title)
        console.log("Image: ", imageURL)
        console.log("Marketplace: ", marketplace)
    }
    
    const timer = ms => new Promise(res => setTimeout(res, ms))
    
    const getMetadata = async (tokenPubKey) => {
        try {
            const addr = await Metadata.getPDA(tokenPubKey)
            const resp = await Metadata.load(metaplexConnection, addr);
            const { data } = await axios.get(resp.data.data.uri);
    
            return data;
        } catch (error) {
            console.log("error fetching metadata: ", error)
        }
    }

    async function stats(name , title, price, date, signature, imageURL, marketplace,mintToken) {
        let linkData = 'https://api-mainnet.magiceden.dev/v2/collections/';
        let statDataName = name.replaceAll(' ', '_');
        linkData += statDataName.toLowerCase();
        linkData += '/stats';
    
        let res = await fetch(linkData)
      
        let json = await res.json();
        if(json.floorPrice === undefined){
            linkData = 'https://api-mainnet.magiceden.dev/v2/collections/';
            statDataName = name.replaceAll(' ', '');
            linkData += statDataName.toLowerCase();
            linkData += '/stats';
            res = await fetch(linkData)
            json = await res.json();
        }
        const divided = 1000000000;
        let fp = json.floorPrice/divided;
        const avg = json.avgPrice24hr/divided;
        const totalvolume = json.volumeAll/divided;
        let difference = price - fp;
        let diff = ' ';
        if(difference<0){
            diff = `\`${difference}\` SOL lower than`
        } else if(difference>0){
            diff = `\`${difference}\` SOL above`
        }   else if(difference==0){
            diff = ` same price as`
        };
        let stat = {ratio: diff ,volume :totalvolume, avergae: avg, listed:json.listedCount, floor: fp};
        postSaleToDiscord(title, price, date, signature, imageURL, marketplace, stat,mintToken);
    }
    const postSaleToDiscord = (title, price, date, signature, imageURL, marketplace,stat,mintToken) => {
        axios.post(DISCORD_URL,
            {
                "embeds": [
                    {
                        "title": `SALE`,
                    "description": `[${title}](https://www.magiceden.io/item-details/${mintToken})`,
                    "fields": [
                        {
                            "name": "Price",
                            "value": `${price} SOL`,
                            "inline": true
                        },
                        {
                            "name": "Date",
                            "value": `${date}`,
                            "inline": true
                        },
                        {
                            "name": "PRICE RATIO",
                            "value": `SOLD ${stat.ratio} \`${stat.floor}\` SOL the floor price with an average of \`${stat.avergae}\` SOL`,
                        },
                        {
                            "name": "Total Volume",
                            "value": `\`${stat.volume}\``,
                            "inline": true
                        },
                        {
                            "name": "Listed count",
                            "value": `\`${stat.listed}\``,
                            "inline": true
                        },
                        {
                            "name": "Explorer",
                            "value": `[SolScan](https://solscan.io/tx/${signature})`,
                        }
                    ],
                    "image": {
                        "url": `${imageURL}`,
                    }
                    }
                ]
            }
        )
    }
}