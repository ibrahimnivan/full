## handleSubmit with toast
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    console.log('handlesubmit active')
    
    const { username, email, password } = formData;
    
    console.log(formData)

    if (!username || !email || !password) {
      toast.error("Please fill all the input fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      if (res.status === 400) {
        toast.error("This email is already registered");
      } else if (res.status === 201) {
        router.push("/login"); // if succeed
      }
    } catch (error: unknown) {
      if (typeof error === "string") {
        toast.error(error);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        // Handle other types or log the error as appropriate
        console.error(error);
      }
    }
  };