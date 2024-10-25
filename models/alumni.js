module.exports = (sequelize, Sequelize) => {
  const Alumni = sequelize.define("alumni", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    fullName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    gender: Sequelize.STRING,
    contactNumber: Sequelize.STRING,
    postalAddress: Sequelize.TEXT,
    yearOfGraduation: Sequelize.INTEGER,
    departmentAndSpecialization: Sequelize.STRING,
    branch: Sequelize.STRING,
    currentJobTitle: Sequelize.STRING,
    companyName: Sequelize.STRING,
    industrySector: Sequelize.STRING,
    linkedInProfileUrl: Sequelize.STRING,
    topicsOfInterest: Sequelize.STRING,
    preferredModeOfSession: Sequelize.STRING,
    participateInFutureSessions: Sequelize.BOOLEAN,
    isVerified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });

  return Alumni;
};
