<form
            className="form shadow  rounded  bg-light"
            onSubmit={handleUpdateForm}
          >
            <div className="form-group" style={{ marginLeft: "30%" }}>
              <label htmlFor="category">Category</label>
              <br />
              <Select
                name="category"
                showSearch
                placeholder="Select a category"
                optionFilterProp="children"
                className="w-50"
                value={productData.category.name}
                onChange={(value) =>
                  setProductData((prev) => ({
                    ...prev,
                    category: {
                      ...prev.category,
                      name: value,
                      id: allCategories.find((cat) => cat.name === value)._id,
                    },
                  }))
                }
              >
                {allCategories &&
                  allCategories.map((cat) => (
                    <Select.Option key={cat._id} value={cat.name}>
                      {cat.name}
                    </Select.Option>
                  ))}
              </Select>
            </div>

            <div className="form-group" style={{ marginLeft: "30%" }}>
              <label htmlFor="name">Name</label>
              <input
                name="name"
                type="text"
                className="form-control w-50 "
                placeholder="Product name"
                value={productData.name}
                onChange={handleChange}
                required
              />
            </div>

            

            <div className="form-group" style={{ marginLeft: "30%" }}>
              <label htmlFor="description">Description</label>
              <input
                name="description"
                type="text"
                className="form-control w-50"
                placeholder="Product description"
                value={productData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group" style={{ marginLeft: "30%" }}>
              <label htmlFor="price">Price</label>
              <input
                name="price"
                type="number"
                className="form-control w-50"
                placeholder="Product price"
                value={productData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group" style={{ marginLeft: "30%" }}>
              <label htmlFor="inStock">In Stock</label>
              <input
                name="inStock"
                type="number"
                className="form-control w-50"
                placeholder="Product inStock"
                value={productData.inStock}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group" style={{ marginLeft: "30%" }}>
              <label htmlFor="shipping">Shipping</label>
              <br />

              <Select
                showSearch
                placeholder="Select shipping"
                optionFilterProp="children"
                className="w-50"
                name="shipping"
                value={productData.shipping ? "YES" : "NO"}
                onChange={(value) =>
                  setProductData((prev) => ({
                    ...prev,
                    shipping: value,
                  }))
                }
                required
              >
                <Select.Option value="1">YES</Select.Option>
                <Select.Option value="0">NO</Select.Option>
              </Select>
            </div>

            <button
              className="btn btn-outline-dark mt-3"
              type="submit"
              style={{ marginLeft: "30%" }}
            >
              Submit
            </button>
            <br />
            <br />
            <br />
          </form>