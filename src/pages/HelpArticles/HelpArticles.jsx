import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { t } from "i18next";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { getHelpArticles } from "../../redux/actions/locationAction";

export default function HelpArticles() {
  const dispatch = useDispatch();
  const { helpArticles } = useSelector((state) => state.locationReducer);

  const [expandedIds, setExpandedIds] = useState([]);

  useEffect(() => {
    dispatch(getHelpArticles());
  }, [dispatch]);

  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const breadcrumbPaths = [
    { label: t("HELP_ARTICLES"), href: "/help-articles" },
  ];

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-12">
        <Breadcrumb paths={breadcrumbPaths} />
      </div>

      <div className="border rounded-md bg-[#EEF4FF] col-span-12 space-y-6 xl:col-span-12 p-2">
        <div className="grid-cols-1 md:grid-cols-12 gap-2">
          {helpArticles.map((article) => {
            const isExpanded = expandedIds.includes(article.id);

            return (
              <div key={article.id} className="col-span-1 mb-3">
                <div className="flex gap-1 flex-col bg-white shadow-md rounded-lg border p-2">
                  <div className="font-medium text-black flex flex-row justify-between items-center rounded-t-md px-2 py-1">
                    <span className="font-bold text-[20px]">{article.title}</span>
                  </div>

                  <hr />

                  {/* Description only shown if expanded */}
                  {isExpanded && (
                    <div className="flex flex-col px-2 mt-1">
                      <span className="text-gray-500 text-sm">
                        {article.description}
                      </span>
                    </div>
                  )}

                  <button
                    onClick={() => toggleExpand(article.id)}
                    className="text-blue-500 mt-2 text-md font-medium self-start px-2"
                  >
                    {isExpanded ? "Show less" : "Show more"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
