import React from "react";
import BookCard from "../Bookcard";

function NewReleases() {
  return (
    <section className="new-releases">
      <h2>SPOTLIGHT ON NEW RELEASES</h2>
      <p>새로 나온 주목할만한 작품들을 만나보세요 ✨</p>
      <div className="book-list">
        {Array.from({ length: 5 }).map((_, idx) => (
          <BookCard key={idx} />
        ))}
      </div>
    </section>
  );
}

export default NewReleases;
