import { GetServerSideProps, NextPage } from "next";
import { useState } from "react";
import styles from "./index.module.css";

// getServerSidePropsから渡されるpropsの型
type Props = {
    initialImageUrl: string;
  };

const IndexPage: NextPage<Props> = ({ initialImageUrl }) => {
  const [imageUrl, setImageUrl] = useState(initialImageUrl); // 初期値を渡す
  const [loading, setLoading] = useState(false); // 初期状態はfalseにしておく
//   const [imageUrl, setImageUrl] = useState("");
//   const [loading, setLoading] = useState(true);

//   // コンポーネントがマウントされた時にfetchImageを実行する
//   // 第二引数に空配列を渡すとマウント時に実行される
//   // useEffect内で渡した関数はレンダリングが完了した後に実行される
//   useEffect(() => {
//     fetchImage().then((newImage) => {
//       setImageUrl(newImage.url);
//       setLoading(false);
//     });
//   }, []);
  // ボタンをクリックしたときに画像を非同期で読み込む
  const handleClick = async () => {
    setLoading(true);
    // async内でfetchImage実行後まで待ちたいからawaitをつける
    const newImage = await fetchImage();
    setImageUrl(newImage.url);
    setLoading(false);
  };

  return (
    // styles. でCSSクラスを参照できる
    <div className={styles.page}>
      <button onClick={handleClick} className={styles.button}>
        他のにゃんこも見る
      </button>
      <div className={styles.frame}>
        {loading || <img src={imageUrl} className={styles.img} />}
      </div>
    </div>
  );
};
export default IndexPage;

// ページがリクエストされるたび、サーバサイドで実行される
// next.jsに認識させるため、exportする必要あり
// IndexPageコンポーネントが引数として受け取る、Propsを返却する
export const getServerSideProps: GetServerSideProps<Props> = async () => {
    const image = await fetchImage();
    return {
      props: {
        initialImageUrl: image.url,
      },
    };
  };

type Image = {
    url: string;
  };

// asyncはこの関数が非同期処理を行うことを表す
const fetchImage = async (): Promise<Image> => {
    // 非同期処理内で順次処理したいのでawaitをつけている
    const res = await fetch("https://api.thecatapi.com/v1/images/search");
    const images = await res.json();
    console.log(images);
    return images[0];
  };