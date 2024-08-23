import { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);

  function deleted(item) {
    setFilter(filter.filter((x) => x !== item));
  }
  function fullDeleted() {
    setFilter([]);
  }
  useEffect(() => {
    fetch("https://dummyjson.czaylabs.com.tr/api/exam/jobs")
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setData(data);
      });
  }, []);

  return (
    <>
      <header className="header"></header>
      <FilterListing
        filter={filter}
        deleted={deleted}
        fullDeleted={fullDeleted}
      />
      <Jobs filter={filter} setFilter={setFilter} data={data} />
    </>
  );
}

function FilterListing({ filter, deleted, fullDeleted }) {
  return (
    filter.length > 0 && (
      <div className="filterlist">
        {filter.map((x, i) => (
          <>
            <div className="job">
              <p key={i}>{x}</p>
              <button className="btn" onClick={() => deleted(x)}>
                x
              </button>
            </div>
          </>
        ))}
        <button className="deleteBtn" onClick={() => fullDeleted()}>Clear</button>
      </div>
    )
  );
}

function Jobs({ filter, setFilter, data }) {
  function addFilter(keyword) {
    if (filter.includes(keyword)) {
      return;
    }
    setFilter([...filter, keyword]);
  }

  data.forEach((x) => {
    x.tags = [x.role, x.level, ...x.languages, ...x.tools];

    // console.log(x.tags);
  });

  // console.log("filtreleme kodu buraya gelecek");

  const filterData = data.filter((x) => {
    let foundFilteredCount = 0;
    for (const filteredTag of filter) {
      if (x.tags.includes(filteredTag)) {
        foundFilteredCount++;
      }
    }

    if (filter.length === foundFilteredCount) {
      return true;
    }
  });

  console.log(filterData);

  return (
    <div className="jobs">
      {filterData.map((x) => (
        <JobItem key={x.id} {...x} addFilter={addFilter} />
      ))}
    </div>
  );
}

function JobItem({
  company,
  logo,
  new: isNew,
  featured,
  position,
  postedAt,
  contract,
  location,
  tags,
  addFilter,
}) {
  return (
    // feturedJob">
    <div className={featured ? "JobItem featuredJob" : "jobItem"}>
      <div className="jobDetails">
        <a href="#" className="companyLogo">
          <img src={logo} alt={company} />
        </a>

        <h4>
          <a href="#">{company}</a>
          {isNew && <span className="new">new!</span>}
          {featured && <span className="featured">featured</span>}
        </h4>
        <h3>{position}</h3>
        <p>
          {postedAt}• {contract} • {location}
        </p>
      </div>

      <div className="jobTags">
        {tags.map((x, i) => (
          <a
            href="#"
            key={i}
            onClick={(e) => {
              e.preventDefault();
              addFilter(x);
            }}
          >
            {x}
          </a>
        ))}
      </div>
    </div>
  );
}
