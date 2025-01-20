import { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";
import styles from "./index.module.css";


// GetServerSidePropsから渡されるpropsの型
type Props = {
    initialImageUrl: string;
};

const IndexPage: NextPage<Props> = ({ initialImageUrl }) => {
    // useStateを使って画像のURLを保持する
    const [imageUrl, setImageUrl] = useState(initialImageUrl);
    const [loading, setLoding] = useState(true);
    // mount時に画像を取得する
    useEffect(() => {
        fetchImage().then((newImage) => {
            setImageUrl(newImage.url); // 画像イメージを更新
            setLoding(false); // ローディングを更新
        })
    }, []);
    // ボタンをクリックした時に画像を更新する
    const handleClick = async () => {
        setLoding(true); // ローディングを更新
        const newImage = await fetchImage();
        setImageUrl(newImage.url); // 画像イメージを更新
        setLoding(false); // ローディングを更新
    };

    return (
        <div className={styles.page}>
            <button onClick={handleClick} className={styles.button}>
                One more cat!
            </button>
            <div className={styles.frame}>
                {loading || <img src={imageUrl} className={styles.img} />}
            </div>
        </div>
    );

};

// サーバーサイドで画像を取得する
export const getServerSideProps: GetServerSideProps<Props> = async () => {
    const image = await fetchImage();
    return {
        props: {
            initialImageUrl: image.url
        },
    };
}

type Image = {
    url: string;
};

const fetchImage = async (): Promise<Image> => {
    const response = await fetch("https://api.thecatapi.com/v1/images/search");
    const images = await response.json();
    return images[0];
};

export default IndexPage;